import { type FC, useState } from "react";
import { Button } from "react-daisyui";
import { type SubmitHandler, useForm } from "react-hook-form";
import { ImageDragField } from "~/components/Commons/ImageDragField";
import { TextField } from "~/components/Commons/TextField";
import {
  useCreateSystemMutation,
  useUpdateSystemMutation,
  useUploadSystemIconMutation,
} from "~/generated/graphql";
import { useFirebaseUrl } from "~/hooks/useFirebaseUrl";
import { useLoading } from "~/hooks/useLoading";
import { useNotification } from "~/hooks/useNotification";
import { useSystem } from "~/hooks/useSystem";

interface FormInput {
  title: string;
  description: string;
}

interface Props {}

/**
 * Site
 *
 * @param {Props} { }
 */
export const SiteSetting: FC<Props> = ({}) => {
  const sendNotification = useNotification();
  const { register, handleSubmit } = useForm<FormInput>();
  const [{ data, fetching, error }] = useSystem();
  const [{ fetching: mutationFetching }, updateSystem] =
    useUpdateSystemMutation();
  const [, uploadSystemIcon] = useUploadSystemIconMutation();
  const [, createSystem] = useCreateSystemMutation();
  const [icon, setIcon] = useState<Blob | null | undefined>();
  const onSubmit: SubmitHandler<FormInput> = ({ title, description }) => {
    if (!data?.findFirstSystem) {
      createSystem({
        input: { id: "system", title, description },
      }).then(async () => {
        if (icon) {
          await uploadSystemIcon({ file: icon });
        }
        sendNotification("設定を更新");
      });
    } else {
      updateSystem({
        title,
        description,
        icon: icon ? undefined : null,
      }).then(() => {
        if (icon) {
          uploadSystemIcon({ file: icon });
        }
        sendNotification("設定を更新");
      });
    }
  };
  useLoading([fetching, mutationFetching]);
  const getFirebaseUrl = useFirebaseUrl();
  if (!data && !error) return null;
  const url =
    data?.findFirstSystem?.icon?.id &&
    getFirebaseUrl(data?.findFirstSystem?.icon?.id);
  return (
    <div className="h-full overflow-y-auto">
      <div className="m-auto max-w-2xl p-8">
        <div className="grid gap-8">
          <h1 className="mb-4 border-b text-xl">サイト情報</h1>
          <TextField
            label="タイトル"
            defaultValue={data?.findFirstSystem?.title}
            {...register("title")}
          />
          <TextField
            label="説明"
            defaultValue={data?.findFirstSystem?.description}
            {...register("description")}
          />
          <ImageDragField
            placeholder="Favicon"
            types={["x-icon"]}
            onChange={setIcon}
            url={url}
          />
          <Button
            onClick={handleSubmit(onSubmit)}
            aria-label="save"
            color="primary"
          >
            保存
          </Button>
        </div>
      </div>
    </div>
  );
};
