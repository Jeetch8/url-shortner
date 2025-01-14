import { useState } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import CountriesList from '@/assets/CountryList.json';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { UrlValidationRegex } from '@/utils/RegExp';
import { IoAddOutline } from 'react-icons/io5';
import { FaRegTrashAlt } from 'react-icons/fa';

const inputClass =
  'outline-blue-300 px-4 py-1 border-2 border-neutral-300 rounded-lg';

const TargetingComp = () => {
  const { register, control, resetField } = useFormContext();
  const { append, remove, fields } = useFieldArray({
    control,
    name: 'link_targetting.rotate',
  });
  const [newInputError, setNewInputError] = useState('');
  const [newUrlInput, setNewUrlInput] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  const handleNewInputSubmit = () => {
    if (new RegExp(UrlValidationRegex).test(newUrlInput)) {
      append(newUrlInput);
      setNewUrlInput('');
      setNewInputError('');
    } else {
      setNewInputError('Invalid URL');
    }
  };

  const handleTabChange = (index: number) => {
    switch (activeTab) {
      case 1: // Location
        resetField('link_targetting.location.country', {
          defaultValue: 'IN',
        });
        resetField('link_targetting.location.redirect_url', {
          defaultValue: '',
        });
        break;
      case 2: // Device
        resetField('link_targetting.device.android', {
          defaultValue: '',
        });
        resetField('link_targetting.device.ios', {
          defaultValue: '',
        });
        resetField('link_targetting.device.windows', {
          defaultValue: '',
        });
        resetField('link_targetting.device.linux', {
          defaultValue: '',
        });
        resetField('link_targetting.device.mac', {
          defaultValue: '',
        });
        break;
      case 3: // Rotate
        resetField('link_targetting.rotate', {
          defaultValue: [],
        });
        break;
      default:
        break;
    }
    setActiveTab(index);
  };

  return (
    <tr>
      <td>Targeting</td>
      <td>
        <Tabs
          selectedIndex={activeTab}
          onSelect={handleTabChange}
          selectedTabClassName="border-black border-2 bg-gray-400 text-white"
        >
          <TabList className={'flex items-center gap-x-2'}>
            <Tab className="border-[1px] border-neutral-400 w-fit px-4 py-1 rounded-md cursor-pointer">
              None
            </Tab>
            <Tab className="border-[1px] border-neutral-400 w-fit px-4 py-1 rounded-md cursor-pointer">
              Location
            </Tab>
            <Tab className="border-[1px] border-neutral-400 w-fit px-4 py-1 rounded-md cursor-pointer">
              Device
            </Tab>
            <Tab className="border-[1px] border-neutral-400 w-fit px-4 py-1 rounded-md cursor-pointer">
              Rotate
            </Tab>
          </TabList>
          <TabPanel></TabPanel>
          <TabPanel>
            <div className="mt-4">
              <select
                {...register('link_targetting.location.country')}
                className="w-[300px] mb-4 px-2 py-2"
                id="countries"
                defaultValue="IN"
              >
                {CountriesList.countries.map((el) => (
                  <option value={el.countryCode} key={el.countryCode}>
                    {el.flag} {el.country}
                  </option>
                ))}
              </select>
              <br />
              <label htmlFor="targeting.location.redirect_url" className="mr-4">
                Destination URL:
              </label>
              <input
                type="text"
                {...register('link_targetting.location.redirect_url', {
                  pattern: {
                    value: UrlValidationRegex,
                    message: 'Provided URL is not valid',
                  },
                })}
                className={inputClass}
              />
            </div>
          </TabPanel>
          <TabPanel>
            <table>
              <tbody className="[&_:where(td)]:py-2">
                <tr>
                  <td>
                    <label htmlFor="targeting.device.android">Android</label>
                  </td>
                  <td>
                    <input
                      type="text"
                      className={inputClass}
                      {...register('link_targetting.device.android', {
                        pattern: {
                          value: UrlValidationRegex,
                          message: 'Provided URL is not valid',
                        },
                      })}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="targeting.device.ios">iOS</label>
                  </td>
                  <td>
                    <input
                      type="text"
                      className={inputClass}
                      {...register('link_targetting.device.ios', {
                        pattern: {
                          value: UrlValidationRegex,
                          message: 'Provided URL is not valid',
                        },
                      })}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="targeting.device.windows">Windows</label>
                  </td>
                  <td>
                    <input
                      type="text"
                      className={inputClass}
                      {...register('link_targetting.device.windows', {
                        pattern: {
                          value: UrlValidationRegex,
                          message: 'Provided URL is not valid',
                        },
                      })}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="link_targetting.device.linux">Linux</label>
                  </td>
                  <td>
                    <input
                      type="text"
                      className={inputClass}
                      {...register('link_targetting.device.linux', {
                        pattern: {
                          value: UrlValidationRegex,
                          message: 'Provided URL is not valid',
                        },
                      })}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="link_targetting.device.mac">Mac</label>
                  </td>
                  <td>
                    <input
                      type="text"
                      className={inputClass}
                      {...register('link_targetting.device.mac', {
                        pattern: {
                          value: UrlValidationRegex,
                          message: 'Provided URL is not valid',
                        },
                      })}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </TabPanel>
          <TabPanel>
            <div className="mt-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-x-2 mt-2">
                  <input
                    type="text"
                    {...register(`link_targetting.rotate.${index}`, {
                      pattern: {
                        value: UrlValidationRegex,
                        message: 'Provided URL is not valid',
                      },
                    })}
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="px-2 py-2 bg-red-500 text-white rounded-lg"
                  >
                    <FaRegTrashAlt />
                  </button>
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-x-2 mt-2">
                <input
                  type="text"
                  onChange={(e) => setNewUrlInput(e.target.value)}
                  className={inputClass}
                  value={newUrlInput}
                  onKeyDown={(e) => e.key === 'Enter' && handleNewInputSubmit()}
                />
                <button
                  className="text-2xl text-white bg-green-400 rounded-md px-1 py-1 cursor-pointer"
                  onClick={handleNewInputSubmit}
                >
                  <IoAddOutline />
                </button>
              </div>
              {newInputError && (
                <p className="text-red-500 text-sm font-semibold ml-2">
                  {newInputError}
                </p>
              )}
            </div>
          </TabPanel>
        </Tabs>
      </td>
    </tr>
  );
};

export default TargetingComp;
