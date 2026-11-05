export default function SectionHeader({ eyebrow, title, subtitle, rightContent }) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        {typeof title === 'string' ? <h2>{title}</h2> : title}
      </div>

      {rightContent ? <div>{rightContent}</div> : null}
      {subtitle ? <p className="section-subtitle">{subtitle}</p> : null}
    </div>
  )
}
