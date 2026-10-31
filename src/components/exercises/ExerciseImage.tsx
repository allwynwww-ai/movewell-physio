import Image from "next/image";
import { EXERCISE_IMAGE_SIZE, type Exercise } from "@/content/exercises";

type Props = {
  image: NonNullable<Exercise["image"]>;
  /** "figure" = large picture on the exercise page; "thumb" = header image on a list card */
  variant?: "figure" | "thumb";
  className?: string;
};

/**
 * Start / End illustration (or a clinic's own photo). The bundled artwork has
 * off-white panels, so in dark mode it sits on a soft light mat instead of
 * being inverted or dropped straight onto the dark background.
 */
export default function ExerciseImage({ image, variant = "figure", className = "" }: Props) {
  const width = image.width ?? EXERCISE_IMAGE_SIZE.width;
  const height = image.height ?? EXERCISE_IMAGE_SIZE.height;

  if (variant === "thumb") {
    return (
      <div className={`bg-white dark:bg-[#EEF1EC] border-b border-[var(--color-border-light)] dark:border-transparent ${className}`}>
        <Image
          data-testid="exercise-image"
          src={image.src}
          alt={image.alt}
          width={width}
          height={height}
          loading="lazy"
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          className="w-full aspect-[2/1] object-cover dark:brightness-[0.97]"
        />
      </div>
    );
  }

  return (
    <figure data-testid="exercise-figure" className={`m-0 ${className}`}>
      <div className="rounded-2xl overflow-hidden bg-white border border-[var(--color-border-light)] dark:bg-[#EEF1EC] dark:border-white/10 dark:p-1.5 shadow-sm">
        <Image
          data-testid="exercise-image"
          src={image.src}
          alt={image.alt}
          width={width}
          height={height}
          priority
          sizes="(min-width: 896px) 832px, 100vw"
          className="w-full h-auto rounded-xl dark:brightness-[0.97]"
        />
      </div>
      <figcaption className="mt-2.5 text-center text-sm text-[var(--color-text-muted)]">Start and end positions</figcaption>
    </figure>
  );
}
