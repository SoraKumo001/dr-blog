import { type FC, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { ContentsView } from "./ContentsView";
import { useFindPostQuery } from "~/generated/graphql";
import { useUser } from "~/hooks/useAuth";
import { useFirebaseUrl } from "~/hooks/useFirebaseUrl";
import { useLoading } from "~/hooks/useLoading";
import { useMarkdown } from "~/libs/markdownConverter";

const context = { additionalTypenames: ["Category"] };

interface Props {
  id: string;
}

/**
 * Contents (Container Component)
 *
 * @param {Props} { id }
 */
export const Contents: FC<Props> = ({ id }) => {
  const navigate = useNavigate();
  const [{ data, fetching, error }] = useFindPostQuery({
    variables: { postId: id },
    context,
  });

  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  const [children, tree] = useMarkdown({
    markdown: data?.findFirstPost?.content,
  });
  
  const session = useUser();
  
  const categories = useMemo(() => {
    return [...(data?.findFirstPost?.categories ?? [])].sort((a, b) =>
      a.name < b.name ? -1 : 1,
    );
  }, [data]);
  
  const getFirebaseUrl = useFirebaseUrl();
  useLoading(fetching);
  
  if (!data?.findFirstPost) return null;
  
  const post = data.findFirstPost;
  const image = post.cardId ? getFirebaseUrl(post.cardId) || undefined : undefined;

  return (
    <ContentsView
      title={post.title}
      updatedAt={post.updatedAt}
      publishedAt={post.publishedAt}
      image={image}
      canEdit={!!session}
      categories={categories}
      markdownChildren={children}
      contentTree={tree}
      onEditClick={() => navigate(`/edit/${id}`)}
    />
  );
};
