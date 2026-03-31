import './LayoutCentral.css'

export default function LayoutCentral({ main, sidebar }) {
  return (
    <section className="layout-central" id="galeria">
      <div className="layout-central-inner section-wrapper">
        <main className="layout-main">{main}</main>
        <aside className="layout-sidebar">{sidebar}</aside>
      </div>
    </section>
  )
}
