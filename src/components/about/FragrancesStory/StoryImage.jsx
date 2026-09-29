// Keep the desktop image element and geometry; only the mobile source changes.
export default function StoryImage({ mobileSrc, alt = '', ...props }) {
  return (
    <picture className="fragrances-story__picture">
      <source media="(width < 768px)" srcSet={mobileSrc} />
      <img {...props} alt={alt} />
    </picture>
  );
}
