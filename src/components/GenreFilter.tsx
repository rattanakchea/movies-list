interface GenreFilterProps {
  genres: readonly string[];
  selected: string | null;
  onSelect: (genre: string | null) => void;
}

const GenreFilter = ({ genres, selected, onSelect }: GenreFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
          selected === null
            ? "gradient-orange text-primary-foreground shadow-sm"
            : "bg-muted text-muted-foreground hover:text-foreground"
        }`}
      >
        All
      </button>
      {genres.map((genre) => (
        <button
          key={genre}
          onClick={() => onSelect(genre === selected ? null : genre)}
          className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
            selected === genre
              ? "gradient-orange text-primary-foreground shadow-sm"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          {genre}
        </button>
      ))}
    </div>
  );
};

export default GenreFilter;
