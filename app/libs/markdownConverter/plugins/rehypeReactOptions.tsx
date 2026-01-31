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

let mermaidRenderer: Promise<{
  render: (id: string, code: unknown) => Promise<{ svg: string }>;
}> | null = null;
let mermaidIframe: HTMLIFrameElement | null = null;
let refCount = 0;

const getMermaidRenderer = () => {
  refCount++;
  if (!mermaidRenderer) {
    mermaidRenderer = new Promise((resolve) => {
      const iframe = document.createElement("iframe");
      mermaidIframe = iframe;
      Object.assign(iframe.style, {
        position: "absolute",
        width: "0",
        height: "0",
        border: "none",
        visibility: "hidden",
      });
      document.body.appendChild(iframe);
      const onMessage = (e: MessageEvent) => {
        if (e.source !== iframe.contentWindow) return;
        if (e.data === "ready") {
          window.removeEventListener("message", onMessage);
          resolve({
            render: async (id: string, code: unknown) => {
              return new Promise((resolveRender, rejectRender) => {
                const channel = new MessageChannel();
                channel.port1.onmessage = (event) => {
                  if (event.data.error) {
                    rejectRender(event.data.error);
                  } else {
                    resolveRender(event.data);
                  }
                  channel.port1.close();
                };
                iframe.contentWindow?.postMessage({ id, code }, "*", [
                  channel.port2,
                ]);
              });
            },
          });
        }
      };
      window.addEventListener("message", onMessage);
      iframe.srcdoc = `<!DOCTYPE html>
<html>
<body>
<script type="module">
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
mermaid.initialize({ startOnLoad: false });
window.parent.postMessage("ready", "*");
window.addEventListener("message", async (e) => {
  const { id, code } = e.data;
  try {
    const { svg } = await mermaid.render(id, code);
    e.ports[0].postMessage({ svg });
  } catch (err) {
    e.ports[0].postMessage({ error: err.message });
  }
});
</script>
</body>
</html>`;
    });
  }
  return mermaidRenderer;
};

const releaseMermaidRenderer = () => {
  refCount--;
  if (refCount === 0) {
    if (mermaidIframe) {
      document.body.removeChild(mermaidIframe);
      mermaidIframe = null;
    }
    mermaidRenderer = null;
  }
};

const Mermaid = ({
  children,
  ...props
}: { children: ReactNode } & ComponentProps<"pre">) => {
  const id = useId();
  const [svg, setSvg] = useState<ReactNode>();
  useEffect(() => {
    getMermaidRenderer();
    return () => releaseMermaidRenderer();
  }, []);
  useEffect(() => {
    const mermaidCode = String(children);
    mermaidRenderer
      ?.then((m) => m.render(id, mermaidCode))
      .then(({ svg }) => setSvg(svg))
      .catch(() => setSvg(undefined));
  }, [children, id]);
  return svg ? (
    <pre
      {...props}
      className="rounded-sm border bg-white p-2 **:overflow-visible"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  ) : (
    children
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
  "data-depth": string;
}) => {
  const dataLine = Number(props["data-line"] ?? 0);
  const dataLanguage = props["data-language"];
  const dataInlineCode = props["data-inline-code"];
  const dataDepth = props["data-depth"];
  const component = useMemo(() => {
    if (dataInlineCode) {
      return <code data-inline-code>{children}</code>;
    }
    if (dataLanguage === "mermaid") {
      return (
        <Mermaid data-depth={dataDepth} data-line={dataLine}>
          {children}
        </Mermaid>
      );
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
              className="overflow-x-auto rounded-sm py-1 font-mono"
              data-depth={dataDepth}
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
                          getTokenProps({ token }).className,
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
  }, [dataInlineCode, dataLanguage, children, dataDepth, dataLine]);
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
