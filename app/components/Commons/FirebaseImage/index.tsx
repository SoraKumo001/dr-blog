import { Image } from "~/components/Commons/Image";
import { useFirebaseUrl } from "~/hooks/useFirebaseUrl";

export const FirebaseImage = ({
  src,
  alt,
  edit,
  width,
  height,
  ...props
}: {
  src: string;
  alt?: string;
  edit?: boolean;
  width?: number;
  height?: number;
} & React.HTMLAttributes<HTMLElement> &
  React.Attributes) => {
  const getFirebaseUrl = useFirebaseUrl();
  const isOptimize = !src.match(/https?:/);
  const url = isOptimize ? getFirebaseUrl(src) : src;

  let style: Record<string, string> = {};
  let parsed = false;
  try {
    const styleString = alt?.match(/^{.*}$/);
    style = styleString ? JSON.parse(alt ?? "") : {};
    parsed = true;
  } catch {}

  if (!parsed) {
    return <img {...props} src={src} alt={alt} />;
  }

  return edit ? (
    <img
      {...props}
      src={url}
      width={width ?? (style.width ? parseInt(style.width) : undefined)}
      height={height ?? (style.height ? parseInt(style.height) : undefined)}
      alt={alt}
    />
  ) : (
    <Image
      src={url}
      width={width ?? (style.width ? parseInt(style.width) : undefined)}
      height={height ?? (style.height ? parseInt(style.height) : undefined)}
      alt={alt}
      isOptimize={isOptimize}
    />
  );
};
