import { Highlight, themes } from "prism-react-renderer";
import {
  useEffect,
  useId,
  useMemo,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import prod from "react/jsx-runtime";
import { Link } from "react-router";
import { useMarkdownContext } from "../markdownContext";
import type { Options as RehypeReactOptions } from "rehype-react";
import { Image } from "~/components/Commons/Image";
import { useFirebaseUrl } from "~/hooks/useFirebaseUrl";
import { classNames } from "~/libs/classNames";

const FirebaseImage = ({
  src,
  alt,
  edit,
  ...props
}: {
  src?: string;
  alt?: string;
  edit?: boolean;
} & React.HTMLAttributes<HTMLElement> &
  React.Attributes) => {
  const getFirebaseUrl = useFirebaseUrl();
  const isOptimize = !src?.match(/https?:/);
  const url = isOptimize && src ? getFirebaseUrl(src) : src;
  try {
    const styleString = alt?.match(/^{.*}$/);
    const style = styleString ? JSON.parse(alt ?? "") : {};
    return edit ? (
      <img
        {...props}
        src={url}
        width={style.width && parseInt(style.width)}
        height={style.height && parseInt(style.height)}
        alt={alt}
      />
    ) : (
      <Image
        {...props}
        src={url ?? ""}
        width={style.width && parseInt(style.width)}
        height={style.height && parseInt(style.height)}
        alt={alt}
        isOptimize={isOptimize}
      />
    );
  } catch {}
  return <img {...props} src={src} alt={alt} />;
};

const Mermaid = ({ children }: { children: ReactNode }) => {
  const id = useId();
  const [svg, setSvg] = useState<string>();
  useEffect(() => {
    import(
      // @ts-ignore
      "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs"
    ).then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
      });
      mermaid.render(id, children).then(({ svg }: { svg: string }) => {
        console.log(svg);
        setSvg(svg);
      });
    });
  }, [children, id]);
  return (
    <pre
      className="rounded border bg-white p-2 [&_*]:overflow-visible"
      dangerouslySetInnerHTML={{ __html: svg ?? String(children) }}
    />
  );
};

const Code = ({
  ref: _,
  children,
  ...props
}: ComponentProps<"code"> & {
  "data-language": string;
  "data-line": number;
  "data-inline-code": boolean;
}) => {
  const dataLine = Number(props["data-line"] ?? 0);
  const dataLanguage = props["data-language"];
  const dataInlineCode = props["data-inline-code"];
  const component = useMemo(() => {
    if (dataInlineCode) {
      return <code data-inline-code>{children}</code>;
    }
    if (dataLanguage === "mermaid") {
      return <Mermaid>{children}</Mermaid>;
    }
    return (
      <Highlight
        theme={themes.shadesOfPurple}
        code={String(children)}
        language={dataLanguage ?? "txt"}
      >
        {({ style, tokens, getLineProps, getTokenProps }) => {
          const numberWidth = Math.floor(Math.log10(tokens.length)) + 1;
          return (
            <div
              style={style}
              className="overflow-x-auto rounded py-1 font-mono"
            >
              {tokens.slice(0, -1).map((line, i) => (
                <div
                  key={i}
                  {...getLineProps({ line })}
                  data-line={dataLine + i + 1}
                >
                  <span
                    className={`sticky left-0 z-10 mr-1 inline-block bg-blue-900 px-2 text-gray-300 select-none`}
                  >
                    <span
                      className="inline-block text-right"
                      style={{ width: `${numberWidth}ex` }}
                    >
                      {i + 1}
                    </span>
                  </span>
                  <span>
                    {line.map((token, key) => (
                      <span
                        key={key}
                        {...getTokenProps({ token })}
                        className={classNames(
                          getTokenProps({ token }).className
                        )}
                      />
                    ))}
                  </span>
                </div>
              ))}
            </div>
          );
        }}
      </Highlight>
    );
  }, [dataInlineCode, children, dataLanguage, dataLine]);
  return component;
};

const Img = (props: ComponentProps<"img">) => {
  const { edit } = useMarkdownContext();
  return <FirebaseImage {...props} edit={edit} />;
};

export const rehypeReactOptions: RehypeReactOptions = {
  ...prod,
  components: {
    code: Code,
    a({ href, ...props }) {
      if (href?.match(/^https:\/\/codepen.io\//)) {
        return (
          <iframe
            loading="lazy"
            allowFullScreen={true}
            src={href.replace("/pen/", "/embed/")}
          />
        );
      }
      return (
        <Link
          {...props}
          to={href ?? ""}
          target={href?.match(/https?:/) ? "_blank" : undefined}
        />
      );
    },
    img: Img,
  },
};
