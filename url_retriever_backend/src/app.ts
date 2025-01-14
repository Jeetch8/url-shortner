require('dotenv').config();
require('express-async-errors');

import express, { Request, Response } from 'express';

const app = express();
import mongoose from 'mongoose';
import { isCuid } from '@paralleldrive/cuid2';
import { ShortendUrlModel } from './models/shortend_url.model';
import { StatModel } from './models/stat.model';
import {
  BadRequestError,
  NotFoundError,
} from '../../shared/utils/CustomErrors';
import requestIp from 'request-ip';
import uap from 'ua-parser-js';
import morgan from 'morgan';
import geoip from 'geoip-lite';
import ejs from 'ejs';
import { isbot } from 'isbot';
import { redisClient } from './redisClient';
import { ShortendUrlDocument } from '@shared/types/mongoose-types';

app.set('view engine', 'ejs');
app.set('trust proxy', true);
app.use(morgan('dev'));

app.get('/verify-password/:shortCode', async (req: Request, res: Response) => {
  const { password } = req.query;
  const shortCode = req.params.shortCode;
  if (!password) throw new BadRequestError('Invalid password provided');
  const obj: ShortendUrlDocument | null = await ShortendUrlModel.findOne({
    shortened_url_cuid: shortCode,
  });
  if (!obj || JSON.stringify(obj) === '{}')
    throw new NotFoundError('Page not found, please check your shortend link');
  const isMatch = await obj.comparePassword(password as string);
  if (isMatch) {
    await registerUserClick(req, obj._id.toString());
    return res.status(200).json({ url: obj.original_url });
  } else {
    return res.status(400).json({ msg: 'Invalid password' });
  }
});

const getShortendUrlObj = async (cuid: string) => {
  let redisRetrived = await redisClient.get(cuid);
  if (redisRetrived) {
    return JSON.parse(redisRetrived);
  } else {
    const obj = await ShortendUrlModel.findOne({ shortened_url_cuid: cuid });
    if (!obj)
      throw new NotFoundError(
        'Page not found, please check your shortend link'
      );
    await redisClient.setEx(
      cuid,
      3600,
      JSON.stringify({
        original_url: obj.original_url,
        sharing_preview: obj.sharing_preview,
        link_cloaking: obj.link_cloaking,
        passwordProtected: obj.protected,
        link_enabled: obj.link_enabled,
      })
    );
    return obj;
  }
};

app.get('/:id', async (req: Request, res: Response) => {
  const cuid = req.params?.id;
  if (!cuid || cuid === '' || !isCuid(cuid))
    throw new BadRequestError('Invalid link');
  const obj = await getShortendUrlObj(cuid);
  if (obj.protected.enabled)
    return res.render('password-prompt', { shortCode: cuid });
  await registerUserClick(req, obj._id);
  const isUserBot = isbot(req.get('user-agent') as string);
  if (isUserBot) {
    return res.render('preview', {
      image: obj.sharing_preview.image,
      title: obj.sharing_preview.title,
      description: obj.sharing_preview.description,
    });
  }
  if (obj.link_cloaking) return res.render('index', { url: obj.original_url });
  else return res.redirect(obj.original_url);
});

const registerUserClick = async (req: Request, shortend_url_id: string) => {
  const clientIp = requestIp.getClientIp(req);
  const ua = uap(req.headers['user-agent']);
  const referrer = req.get('Referrer');
  const geo = geoip.lookup(clientIp!); //223.233.80.198
  const clicker_info = {
    ip_address: clientIp,
    browser: ua.browser.name ?? 'unknown',
    device: ua.device.type ?? 'unknown',
    referrer: referrer ?? 'direct',
    platform: ua.engine.name ?? 'unknown',
    location: {
      country: geo?.country ?? 'unknown',
      city: geo?.city ?? 'unknown',
    },
  };
  await StatModel.findOneAndUpdate(
    { shortend_url_id },
    {
      $inc: { total_clicks: 1 },
      $push: { clicker_info },
    }
  );
};

const serverInit = async () => {
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION_URL!).then(() => {
      console.log('Mongo DB Connected');
    });
    app.listen(8000, () => {
      console.log('URL Retrieval Server Initialized on PORT 8000');
    });
  } catch (error) {
    console.log(error);
  }
};

serverInit();
