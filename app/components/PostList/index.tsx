import { type FC, useMemo } from "react";
import { Link } from "react-router";
import type { Query } from "~/generated/graphql";
import { Image } from "~/components/Commons/Image";
import { useFirebaseUrl } from "~/hooks/useFirebaseUrl";
import { classNames } from "~/libs/classNames";
import { DateString } from "~/libs/dateString";

interface Props {
  id?: string;
  title: string;
  posts: Query["findManyPost"];
  limit?: number;
}

/**
 * PostList
 *
 * @param {Props} { }
 */
export const PostList: FC<Props> = ({ id, title, posts, limit }) => {
  const list = useMemo(
    () => posts.slice(0, limit ?? Number.MAX_VALUE),
    [limit, posts],
  );
  const getFirebaseUrl = useFirebaseUrl();

  return (
    <>
      <div className="m-auto mb-4 border-b text-center text-3xl text-blue-900">
        <Link to={`/category/${id ?? ""}`} viewTransition>
          📚 {title}
        </Link>
      </div>
      <div className="mx-auto grid w-[90%] max-w-[1216px] grid-cols-1 place-items-center gap-4 xl:grid-cols-2">
        {list.map((post) => (
          <Link
            key={post.id}
            className={classNames(
              "flex h-32 w-full max-w-[600px] items-center gap-3 overflow-hidden rounded-lg border px-4 py-8 shadow hover:bg-gray-100 bg-gray-200",
              post.published ? "border-blue-400 bg-gray-200" : "border-red-300",
            )}
            to={`/contents/${post.id}`}
            viewTransition
          >
            <div className="flex w-20 items-center justify-center rounded-sm">
              {post.cardId ? (
                <Image
                  className="w-20 rounded-full"
                  src={getFirebaseUrl(post.cardId)}
                  alt="Eye catch"
                  width={80}
                  height={80}
                  isOptimize
                />
              ) : (
                <span className="text-6xl">📖</span>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-2 overflow-hidden">
              <div className="line-clamp-2 flex-1 border-b text-[22px]">
                {post.title}
              </div>
              <div className="flex gap-2 text-sm whitespace-nowrap">
                <div>公開: {DateString(post.publishedAt)}</div>
                <div>更新: {DateString(post.updatedAt)}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {limit && posts.length > limit && (
        <div className="mt-3 text-center">
          <Link
            to={`/category/${id ?? ""}`}
            className={`
              text-center text-2xl text-blue-600 underline
              hover:font-bold hover:text-blue-800
            `}
            viewTransition
          >
            more…
          </Link>
        </div>
      )}
    </>
  );
};
