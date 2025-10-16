import Button from './Button';

function ProjectCard({ title, description, tags, github, demo }) {
  return (
    <div className="backdrop-blur-sm bg-white/5 rounded-2xl p-6 flex flex-col h-full hover:bg-purple-500/10 hover:scale-[1.02] transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-white line-clamp-1">
          {title}
        </h3>
        <svg className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </div>

      {/* Description */}
      <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">
        {description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1.5 text-sm bg-purple-500/20 text-purple-300 rounded-md border border-purple-500/30"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => window.open(github, '_blank')}
          className="flex-1"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
          <span className="text-sm">Código</span>
        </Button>
        
        {demo && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => window.open(demo, '_blank')}
            className="flex-1"
          >
            <span className="text-sm">Demo</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Button>
        )}
      </div>
    </div>
  );
}

export default ProjectCard;