import usePreferences from '../hooks/usePreferences';
import Projects from '../components/Projects';
import Icon from './Icons';

export default function SectionContent({ section, labels }) {
  const { copy } = usePreferences();
  if (section === 'projects') return <Projects />;
  if (section === 'experience') return <>
    <p className="section-lead">{copy.about.experience.description}</p>
    <ol className="timeline">{copy.about.experience.roles.map(role => <li key={role.years}><time>{role.years}</time><h3>{role.title}</h3><p>{role.center}</p></li>)}</ol>
    <ul className="tags" aria-label={copy.about.technologiesLabel}>{copy.about.experience.tools.map(tool => <li key={tool}>{tool}</li>)}</ul>
  </>;
  if (section === 'education') return <ol className="timeline">{[...copy.about.education].sort((a, b) => Number(b.years.slice(0, 4)) - Number(a.years.slice(0, 4))).map(item => <li key={item.title}><time>{item.years}</time><h3>{item.title}</h3><p>{item.center}</p>{item.note && <p>{item.note}</p>}</li>)}</ol>;
  if (section === 'skills') return <><p className="section-lead">{copy.skills.subtitle}</p><h3 className="group-title">{labels.demonstrated}</h3><div className="skill-list">{copy.skills.categories.map((category, index) => <div key={category.title} className={index === 5 ? 'learning-row' : ''}>{index === 5 && <p className="group-title">{labels.learning}</p>}<h4>{category.title}</h4><ul className="tags">{category.skills.map(skill => <li key={skill}>{skill}</li>)}</ul></div>)}</div></>;
  if (section === 'about') return <><p className="section-role">{copy.hero.kicker}</p>{copy.hero.intro.map(paragraph => <p className="section-lead" key={paragraph}>{paragraph}</p>)}<div className="profile-facts"><p><strong>{copy.hero.locationLabel}</strong>{copy.hero.location}</p><p><strong>{copy.header.languageLabel}</strong>{copy.hero.languages}</p></div><h3>{copy.hero.objectivesLabel}</h3><p className="section-lead">{copy.hero.objectives}</p></>;
  return <><h3 className="contact-heading">{copy.footer.title}</h3><p className="section-lead">{copy.footer.description}</p><a className="contact-email" href={`mailto:amedinaf.it@gmail.com?subject=${encodeURIComponent(copy.hero.emailSubject)}&body=${encodeURIComponent(copy.hero.emailBody)}`}>amedinaf.it@gmail.com<Icon name="arrow" /></a><div className="contact-links"><a href="https://github.com/medinafdzz" target="_blank" rel="noopener noreferrer">GitHub <Icon name="arrow"/></a><a href="https://linkedin.com/in/medinafdzz" target="_blank" rel="noopener noreferrer">LinkedIn <Icon name="arrow"/></a><a href="/CV.pdf" download="CV_Alejandro_Medina.pdf">{copy.footer.downloadCv}<Icon name="download"/></a></div><p className="contact-legal">{copy.footer.legal}</p></>;
}
