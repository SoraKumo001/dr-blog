import { useState, useTransition } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  useFindPostQuery,
  useUpdatePostMutation,
  useUploadPostIconMutation,
  useUploadPostImageMutation,
} from "~/generated/graphql";
import { useNotification } from "~/hooks/useNotification";

export type FormInput = {
  categories: string[];
  title: string;
  published: boolean;
  publishedAt: Date;
  card?: Blob | null;
};

export const usePostEditor = (id: string) => {
  const [{ fetching: fetchLoading, data }] = useFindPostQuery({
    variables: { postId: id },
  });
  const [{ fetching: updateLoading }, updatePost] = useUpdatePostMutation();
  const [{ fetching: uploadCardLoading }, uploadPostIcon] =
    useUploadPostIconMutation();
  const [{ fetching: uploadLoading }, uploadFile] =
    useUploadPostImageMutation();

  const [content, setContent] = useState<string>();
  const [, startTransition] = useTransition();
  const sendNotification = useNotification();

  const [card, setCard] = useState<Blob | null | undefined>();

  const { control, handleSubmit } = useForm<FormInput>();

  const onSubmit: SubmitHandler<FormInput> = ({
    title,
    categories,
    published,
    publishedAt,
  }) => {
    updatePost({
      postId: id,
      title,
      content,
      published,
      cardId: card === null ? null : undefined,
      categories: {
        set: categories.map((catId) => ({ id: catId })),
      },
      publishedAt: new Date(publishedAt).toISOString(),
    })
      .then((result) => {
        if (result.error || !card) return result;
        return uploadPostIcon({ postId: id, file: card });
      })
      .then((result) => {
        sendNotification(result?.error ? "Error" : "Update Post Success");
      });
  };

  const setEditorContent = (newContent: string) => {
    startTransition(() => setContent(newContent));
  };

  const uploadPostImage = (file: Blob) => {
    return uploadFile({ postId: id, file });
  };

  return {
    post: data?.findFirstPost,
    content,
    setEditorContent,
    control,
    handleSubmit,
    onSubmit,
    card,
    setCard,
    uploadPostImage,
    isLoading:
      fetchLoading || updateLoading || uploadCardLoading || uploadLoading,
  };
};
