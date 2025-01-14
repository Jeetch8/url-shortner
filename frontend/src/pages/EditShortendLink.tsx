// type ObjectFieldsNameType<T> = T extends object
//   ? {
//       [K in keyof T]: `${Exclude<K, symbol>}${ObjectFieldsNameType<
//         T[K]
//       > extends never
//         ? ""
//         : `.${ObjectFieldsNameType<T[K]>}`}`;
//     }[keyof T]
//   : never;

interface IFormDefaultValues {
  link_title: string;
  link_description: string;
  original_url: string;
  link_enabeld: boolean;
  shortend_url_cuid: string;
  link_cloaking: boolean;
  sharing_preview: {
    enabeld: boolean;
    title: string;
    description: string;
    image: string;
  };
  protected: {
    enabeld: boolean;
    password: string;
  };
  link_expiry: {
    enabeld: boolean;
    expiryDateAndTime: string;
    expiryRedirectUrl: string;
  };
  link_targetting: {
    enabeld: boolean;
    location: {
      country: string;
      redirect_url: string;
    };
    device: {
      android: string;
      ios: string;
      windows: string;
      linux: string;
      mac: string;
    };
    rotate: string[];
  };
}

import { toast } from 'react-hot-toast';
import { useFetch } from '@/hooks/useFetch';
import { base_url } from '@/utils/base_url';
import {
  useForm,
  Controller,
  FormProvider,
  SubmitHandler,
} from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import { Tooltip } from 'react-tooltip';
import { BsInfoCircle } from 'react-icons/bs';
import { useNavigate, useParams } from 'react-router-dom';
import { ShortendUrl } from '@shared/types/mongoose-types';
import { useEffect } from 'react';
import { useUserContext } from '@/context/UserContext';
import { IoLockClosed } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import ErrorDisplayComp from '@/components/Form/ErrorDisplayComp';
import HookSwitchCheckbox from '@/components/Form/HookSwitchCheckbox';
import TargetingComp from '@/components/EditShortendLink/TargetingComp';

const UrlValidationRegex =
  /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;

const inputClass =
  'outline-blue-300 px-4 py-1 border-2 border-neutral-300 rounded-lg';

export const UpgradeRequiredTooltip = () => {
  return (
    <>
      <a id="upgrade_required" className="ml-2">
        <IoLockClosed size={16} />
      </a>
      <Tooltip anchorSelect="#upgrade_required" clickable>
        <Link to={'/subscribe'} className="underline">
          Upgrade
        </Link>
        <span> required to use this feature</span>
      </Tooltip>
    </>
  );
};

const CreateShortendLink = () => {
  const { user } = useUserContext();
  const { linkId } = useParams();
  const navigate = useNavigate();
  const formMethods = useForm<IFormDefaultValues>({});
  const { doFetch: fetchEditLink } = useFetch({
    url: base_url + '/url/' + linkId,
    method: 'PATCH',
    authorized: true,
    onSuccess: () => {
      toast.success('Changes Saved');
      navigate('/links/' + linkId);
    },
    onError: (err) => {
      toast.error('Error saving changes');
      console.log(err);
    },
  });
  const { doFetch: fetchLinkDetails } = useFetch<{
    link: ShortendUrl;
    data: any;
  }>({
    url: base_url + '/url/' + linkId,
    authorized: true,
    method: 'GET',
    onSuccess(data) {
      formMethods.reset(data.link);
    },
  });

  useEffect(() => {
    fetchLinkDetails();
  }, []);

  const onSubmit: SubmitHandler<IFormDefaultValues> = async (data) => {
    await fetchEditLink(data);
  };

  return (
    <div className="max-w-[1600px] pt-[40px] py-5  rounded-lg w-full mx-auto h-full">
      <div className="bg-white px-5 py-3 rounded-lg h-full">
        <h2 className="text-3xl font-semibold">Edit Link</h2>
        <FormProvider {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(onSubmit)}>
            <div className="flex justify-end mt-4">
              <button
                className="bg-blue-600 px-4 py-2 rounded-md text-white mr-6 disabled:bg-blue-950"
                disabled={!formMethods.formState.isDirty}
              >
                Save changes
              </button>
            </div>
            <table className="mt-6 [&_:where(td)]:py-4">
              <tbody>
                <tr>
                  <td className="w-[400px]">
                    <label htmlFor="original_url">Original Link</label>
                  </td>
                  <td>
                    <input
                      {...formMethods.register('original_url', {
                        required: {
                          value: true,
                          message: 'URL is required',
                        },
                        pattern: {
                          value: UrlValidationRegex,
                          message: 'Invalid URL',
                        },
                      })}
                      aria-label="original url field"
                      className={inputClass}
                      type="text"
                    />
                    <ErrorDisplayComp
                      error={formMethods.formState.errors.original_url}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Slug</td>
                  <td>
                    <input
                      type="text"
                      id="slug"
                      aria-label="URL slug"
                      className={inputClass}
                      {...formMethods.register('shortend_url_cuid', {
                        minLength: {
                          value: 6,
                          message: 'Min length is 6',
                        },
                        maxLength: {
                          value: 6,
                          message: 'Max length is 6',
                        },
                      })}
                    />
                    <ErrorDisplayComp
                      error={formMethods.formState.errors.shortend_url_cuid}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className=" flex items-center">
                      Link enabeld
                      <a
                        className="inline-block ml-2 w-fit"
                        data-tooltip-id="link_enabeld_info"
                        data-tooltip-content={
                          'If link is disabled the user will be redirected to a 404 default page if not provided'
                        }
                        data-tooltip-place="top-start"
                      >
                        <BsInfoCircle size={13} color="grey" />
                      </a>
                    </p>
                    <Tooltip
                      place="top-start"
                      id="link_enabeld_info"
                      positionStrategy="absolute"
                    />
                  </td>
                  <td>
                    <HookSwitchCheckbox
                      register={formMethods.register}
                      fieldName="link_enabeld"
                      label="link enabeld toggler"
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className=" flex items-center">
                      Password protected
                      {user?.product.features.link_password_protection && (
                        <>
                          <a
                            className="inline-block ml-2 w-fit"
                            data-tooltip-id="password_protected_info"
                            data-tooltip-content={
                              'Shortend url visitor will be asked for password before redirecting to the original url'
                            }
                            data-tooltip-place="top-start"
                          >
                            <BsInfoCircle size={13} color="grey" />
                          </a>
                          <Tooltip
                            place="top-start"
                            id="password_protected_info"
                            positionStrategy="absolute"
                          />
                        </>
                      )}
                      {!user?.product.features.link_password_protection && (
                        <UpgradeRequiredTooltip />
                      )}
                    </p>
                    {!user?.product.features.link_password_protection && (
                      <Tooltip place="top-start" id="upgrade_required" />
                    )}
                  </td>
                  <td>
                    <HookSwitchCheckbox
                      register={formMethods.register}
                      fieldName="protected.enabeld"
                      checkboxRules={{
                        disabled:
                          !user?.product.features.link_password_protection,
                      }}
                      label="Password protection enabeld toggler"
                    />
                  </td>
                </tr>
                <tr
                  className={twMerge(
                    !formMethods.watch('protected.enabeld') && 'hidden'
                  )}
                >
                  <td>
                    <label htmlFor="password">Password :</label>
                  </td>
                  <td>
                    <input
                      aria-label="password field"
                      disabled={!formMethods.watch('protected.enabeld')}
                      {...formMethods.register('protected.password', {
                        disabled:
                          !user?.product.features.link_password_protection,
                        required: {
                          value: formMethods.getValues('protected.enabeld'),
                          message: 'Password is required',
                        },
                        pattern: {
                          value:
                            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
                          message:
                            'Password must be atleast 8 characters and should contain 1 uppercase letter, 1 lowercase letter, and 1 number',
                        },
                        maxLength: {
                          value: 10,
                          message: 'Password should be less than 10 characters',
                        },
                      })}
                      type="password"
                      id="protected.password"
                      name="protected.password"
                      className={twMerge(
                        inputClass,
                        'disabled:cursor-not-allowed'
                      )}
                    />
                    <ErrorDisplayComp
                      error={formMethods.formState.errors.protected?.password}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className=" flex items-center">
                      Link Cloaking
                      <a
                        className="inline-block ml-2 w-fit"
                        data-tooltip-id="link_cloaking_info"
                        data-tooltip-content={
                          "Hide's the destination address of this link by opening it in an iFrame."
                        }
                        data-tooltip-place="top-start"
                      >
                        <BsInfoCircle size={13} color="grey" />
                      </a>
                      {!user?.product.features.link_cloaking && (
                        <UpgradeRequiredTooltip />
                      )}
                    </p>
                    <Tooltip place="top-start" id="link_cloaking_info" />
                  </td>
                  <td>
                    <HookSwitchCheckbox
                      register={formMethods.register}
                      fieldName="link_cloaking"
                      label="Link cloaking enabeld toggler"
                      checkboxRules={{
                        disabled: !user?.product.features.link_cloaking,
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="flex items-center gap-x-1">
                    <span className="inline-block">Link Expiry</span>
                    {!user?.product.features.link_expiration && (
                      <UpgradeRequiredTooltip />
                    )}
                  </td>
                  <td>
                    <HookSwitchCheckbox
                      register={formMethods.register}
                      fieldName="link_expiry.enabeld"
                      label="Link expiry enabeld toggler"
                      checkboxRules={{
                        disabled: !user?.product.features.link_expiration,
                      }}
                    />
                  </td>
                </tr>
                <tr
                  className={twMerge(
                    !formMethods.watch('link_expiry.enabeld') && 'hidden'
                  )}
                >
                  <td>
                    <label htmlFor="link_expiry.expiryDateAndTime">
                      Expiry Date And Time:
                    </label>
                  </td>
                  <td aria-label="date picker">
                    <Controller
                      rules={{
                        required: {
                          value: formMethods.getValues('link_expiry.enabeld'),
                          message: 'Valid expiry date and time is required',
                        },
                      }}
                      control={formMethods.control}
                      name="link_expiry.expiryDateAndTime"
                      render={({ field: { onChange, value } }) => (
                        <DateTimePicker
                          onChange={onChange}
                          value={value}
                          className="px-2"
                        />
                      )}
                    />
                    <ErrorDisplayComp
                      error={
                        formMethods.formState.errors.link_expiry
                          ?.expiryDateAndTime
                      }
                    />
                  </td>
                </tr>
                <tr
                  className={twMerge(
                    !formMethods.watch('link_expiry.enabeld') && 'hidden'
                  )}
                >
                  <td>
                    <label htmlFor="link_expiry.expiryRedirectUrl">
                      Expriy destination:
                    </label>
                  </td>
                  <td>
                    <input
                      className={inputClass}
                      aria-label="Redirect URL after link expiraties field"
                      {...formMethods.register(
                        'link_expiry.expiryRedirectUrl',
                        {
                          pattern: {
                            value: UrlValidationRegex,
                            message: 'Input is not an URL',
                          },
                        }
                      )}
                    />
                    <ErrorDisplayComp
                      error={
                        formMethods.formState.errors.link_expiry
                          ?.expiryRedirectUrl
                      }
                    />
                  </td>
                </tr>
                <TargetingComp />
                <tr>
                  <td className="flex items-center gap-x-1">
                    Custom Link Preview
                    {!user?.product.features.custom_link_sharing_preview && (
                      <UpgradeRequiredTooltip />
                    )}
                  </td>
                  <td>
                    <HookSwitchCheckbox
                      register={formMethods.register}
                      fieldName="sharing_preview.enabeld"
                      label="Custom link preview enabeld toggler"
                      checkboxRules={{
                        disabled:
                          !user?.product.features.custom_link_sharing_preview,
                      }}
                    />
                  </td>
                </tr>
                <tr
                  className={twMerge(
                    !formMethods.watch('sharing_preview.enabeld') && 'hidden'
                  )}
                >
                  <td>
                    <label htmlFor="link_preview.title">Title</label>
                  </td>
                  <td>
                    <input
                      aria-label="Title on link preview"
                      {...formMethods.register('sharing_preview.title', {
                        minLength: {
                          value: 30,
                          message: 'Title min length is 30',
                        },
                        maxLength: {
                          value: 60,
                          message: 'Max length is 60',
                        },
                      })}
                      type="text"
                      className="mt-2 border-2 outline-none rounded-md ml-2 px-2 py-1"
                    />
                    <ErrorDisplayComp
                      error={
                        formMethods.formState.errors.sharing_preview?.title
                      }
                    />
                  </td>
                </tr>
                <tr
                  className={twMerge(
                    !formMethods.watch('sharing_preview.enabeld') && 'hidden'
                  )}
                >
                  <td>
                    <label htmlFor="link_preview.description">
                      Description
                    </label>
                  </td>
                  <td>
                    <input
                      aria-label="Description on link preview"
                      {...formMethods.register('sharing_preview.description', {
                        minLength: {
                          value: 55,
                          message: 'Min length is 55',
                        },
                        maxLength: {
                          value: 200,
                          message: 'Max lenght is 200',
                        },
                      })}
                      type="text"
                      className="mt-2 border-2 outline-none rounded-md ml-2 px-2 py-1"
                    />
                    <ErrorDisplayComp
                      error={
                        formMethods.formState.errors.sharing_preview
                          ?.description
                      }
                    />
                  </td>
                </tr>
                <tr
                  className={twMerge(
                    !formMethods.watch('sharing_preview.enabeld') && 'hidden'
                  )}
                >
                  <td>
                    <label htmlFor="link_preview.image">Image</label>
                  </td>
                  <td>
                    <input
                      {...formMethods.register('sharing_preview.image')}
                      type="file"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            {formMethods.watch('sharing_preview.enabeld') && (
              <div className="border-2 w-fit mt-4 min-w-[350px] rounded-md">
                {formMethods.watch('sharing_preview.image') && (
                  <div
                    style={{
                      backgroundImage: `url(${formMethods.watch(
                        'sharing_preview.image'
                      )})`,
                      width: '400px',
                      height: '200px',
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                    }}
                  ></div>
                )}
                <div className="px-4 py-2 max-w-[600px] w-full">
                  <div
                    className="w-full h-[300px] border-2"
                    style={{
                      backgroundImage: formMethods.watch(
                        'sharing_preview.image'
                      ),
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: 'fit',
                    }}
                  ></div>
                  <h4 className="font-semibold mt-2">
                    {formMethods.watch('sharing_preview.title') ?? 'Title'}
                  </h4>
                  <p className="mt-2">
                    {formMethods.watch('sharing_preview.description') ??
                      'Description'}
                  </p>
                </div>
              </div>
            )}
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default CreateShortendLink;
