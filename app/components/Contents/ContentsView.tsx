import { Button } from "react-daisyui";
import { MdEditNote as EditIcon } from "react-icons/md";
import { Link } from "react-router";
import { Head } from "../Commons/Head";
import { ContentTable } from "../ContentTable";
import { MarkdownContent } from "../MarkdownContent";
import { Title } from "../System/Title";
import type { FC, ReactNode } from "react";
import { Image } from "~/components/Commons/Image";
import { DateString } from "~/libs/dateString";

interface ContentsViewProps {
  title: string;
  updatedAt: string;
  publishedAt: string;
  image?: string;
  canEdit: boolean;
  categories: { id: string; name: string }[];
  markdownChildren: ReactNode;
  contentTree: unknown;
  onEditClick: () => void;
}

/**
 * ContentsView (Presentational Component)
 */
export const ContentsView: FC<ContentsViewProps> = ({
  title,
  updatedAt,
  publishedAt,
  image,
  canEdit,
  categories,
  markdownChildren,
  contentTree,
  onEditClick,
}) => {
  return (
    <>
      <Head>
        <meta name="date" content={new Date(updatedAt).toISOString()} />
      </Head>
      <Title image={image}>{title}</Title>
      <div className="relative w-full">
        {canEdit && (
          <Button
            variant="outline"
            size="sm"
            className="fixed top-24 right-8 z-10"
            onClick={onEditClick}
          >
            <EditIcon size={24} />
          </Button>
        )}
        <h1
          className="m-4 inline-flex flex-nowrap items-center justify-center gap-4 border-b-2 border-gray-300 p-2 px-8 text-center text-3xl/10"
          id="header-top"
        >
          {image ? (
            <Image
              className="flex size-20 items-center justify-center overflow-hidden rounded-full text-base"
              src={image}
              alt="Eye catch"
              width={80}
              height={80}
              isOptimize
            />
          ) : (
            <div className="flex size-20 items-center justify-center overflow-hidden rounded-full text-6xl">
              📖
            </div>
          )}
          <div className="flex-1">{title}</div>
        </h1>
        <div className="m-auto flex max-w-360 flex-row-reverse flex-wrap items-start justify-center gap-2 px-2">
          <ContentTable
            className="sticky top-16 mx-auto max-w-xs px-4"
            title={title}
            tree={contentTree}
          />
          <div className="w-full max-w-5xl overflow-hidden">
            <div className="px-8 text-end font-mono text-gray-500">
              <span className="inline-block w-32">publication: </span>
              <span className="inline-block w-24">
                {DateString(publishedAt)}
              </span>
            </div>
            <div className="px-8 text-end font-mono text-gray-500">
              <span className="inline-block w-32">update:</span>
              <span className="inline-block w-24">
                {DateString(updatedAt)}
              </span>
            </div>
            {categories.length > 0 && (
              <div className="m-4 flex flex-wrap gap-2">
                {categories.map(({ id, name }) => (
                  <Link
                    className="rounded-sm bg-blue-500 px-4 py-2 text-white shadow-sm hover:bg-blue-300"
                    key={id}
                    to={`/category/${id}`}
                  >
                    {name}
                  </Link>
                ))}
              </div>
            )}
            <MarkdownContent className="relative z-10 flex-1 overflow-x-hidden rounded-sm border bg-slate-100 p-4 shadow-sm">
              {markdownChildren}
            </MarkdownContent>
          </div>
        </div>
      </div>
    </>
  );
};
