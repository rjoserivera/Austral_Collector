import { useState, useRef, useEffect } from 'react'
import './CreatePostModal.css'
import { API_URL, BASE_URL } from '../config.js'
import { savePostOffline, fileToBase64 } from '../utils/offlineSync'

export default function CreatePostModal({ isOpen, onClose, onSuccess, currentUserId, editingPost }) {
  const isEditing = !!editingPost

  const [tipo, setTipo] = useState('figura')
  const [nombre, setNombre] = useState('')
  const [anio, setAnio] = useState('')
  const [descripcion, setDescripcion] = useState('')
  // images array: { id: string, file: File|null, url: string, isKept: boolean }
  const [images, setImages] = useState([]) 
  const fileInputRef = useRef(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hashtags, setHashtags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [allHashtags, setAllHashtags] = useState([])
  const [filteredTags, setFilteredTags] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // Drag and Drop state
  const dragItem = useRef(null)
  const dragOverItem = useRef(null)

  // Pre-fill form when editing
  useEffect(() => {
    if (editingPost) {
      setTipo(editingPost.tipo || 'figura')
      setNombre(editingPost.nombre || '')
      setAnio(editingPost.anio || '')
      setDescripcion(editingPost.descripcion || '')
      setHashtags(editingPost.hashtags || [])
      
      const loadedImages = []
      if (editingPost.imagen_url) {
        loadedImages.push({
          id: 'kept_' + Date.now(),
          file: null,
          url: `${BASE_URL}/${editingPost.imagen_url}`,
          isKept: true,
          originalUrl: editingPost.imagen_url
        })
      }
      if (editingPost.imagenes_extra && Array.isArray(editingPost.imagenes_extra)) {
        editingPost.imagenes_extra.forEach((ext_url, i) => {
          loadedImages.push({
            id: 'kept_' + Date.now() + '_' + i,
            file: null,
            url: `${BASE_URL}/${ext_url}`,
            isKept: true,
            originalUrl: ext_url
          })
        })
      }
      setImages(loadedImages)
    } else {
      setTipo('figura')
      setNombre('')
      setAnio('')
      setDescripcion('')
      setHashtags([])
      setImages([])
    }
  }, [editingPost])

  // Cargar hashtags existentes para sugerencias
  useEffect(() => {
    if (isOpen) {
      fetch(`${API_URL}/public/get_hashtags.php`)
        .then(r => r.json())
        .then(d => {
          if (d.success) setAllHashtags(d.hashtags || [])
        })
        .catch(e => console.error("Error fetching hashtags:", e))
    }
  }, [isOpen])

  // Filtrar sugerencias cuando cambia el input
  useEffect(() => {
    const query = tagInput.trim().toLowerCase().replace(/^#/, '')
    if (query.length > 0) {
      const filtered = allHashtags.filter(h => 
        h.toLowerCase().includes(query) && 
        !hashtags.map(t => t.toLowerCase()).includes(h.toLowerCase())
      ).slice(0, 5) // limitar a 5 sugerencias
      setFilteredTags(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setFilteredTags([])
      setShowSuggestions(false)
    }
  }, [tagInput, allHashtags, hashtags])

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag(tagInput)
    }
  }

  const addTag = (val) => {
    const cleanVal = val.trim().replace(/^#/, '')
    if (cleanVal && !hashtags.map(t => t.toLowerCase()).includes(cleanVal.toLowerCase())) {
      setHashtags([...hashtags, cleanVal])
      setTagInput('')
      setShowSuggestions(false)
    }
  }

  const removeTag = (tagToRemove) => {
    setHashtags(hashtags.filter(t => t !== tagToRemove))
  }

  const handleClose = () => {
    try {
      const hasData = nombre?.toString().trim() !== '' ||
                      String(anio || '').trim() !== '' ||
                      descripcion?.toString().trim() !== '' ||
                      images.length > 0 ||
                      hashtags.length > 0 ||
                      tagInput?.toString().trim() !== ''

      if (!isEditing && hasData) {
        setShowConfirm(true)
      } else {
        onClose()
      }
    } catch(e) {
      onClose()
    }
  }


  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    const newImages = []
    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`La imagen ${file.name} supera los 5MB.`)
        return
      }
      newImages.push({
        id: 'new_' + Math.random().toString(36).substr(2, 9),
        file: file,
        url: URL.createObjectURL(file),
        isKept: false
      })
    })

    setImages(prev => [...prev, ...newImages])
    // Clear input so same file can be selected again
    e.target.value = null
  }

  const removeImage = (idToRemove) => {
    setImages(prev => prev.filter(img => img.id !== idToRemove))
  }

  // --- Drag and Drop Handlers ---
  const [draggedIndex, setDraggedIndex] = useState(null)

  const handleDragStart = (e, index) => {
    setDraggedIndex(index)
    // Requerido por Firefox para habilitar arrastre
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', e.target)
    
    // Defer opacity change so the dragged ghost image keeps full opacity
    setTimeout(() => {
      e.target.classList.add('dragging')
    }, 0)
  }

  const handleDragEnter = (e, index) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    // Reordenamiento en vivo
    setImages(prev => {
      const newImages = [...prev]
      const draggedItem = newImages.splice(draggedIndex, 1)[0]
      newImages.splice(index, 0, draggedItem)
      return newImages
    })
    // Actualizamos el índice activo al que acabamos de mover
    setDraggedIndex(index)
  }

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging')
    setDraggedIndex(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!nombre) {
      alert('El nombre es obligatorio.')
      return
    }
    if (images.length === 0) {
      alert('Debes agregar al menos una imagen (portada).')
      return
    }

    setIsSubmitting(true)

    // ==== OFFLINE HANDLING ==== //
    if (!navigator.onLine) {
      try {
        const imagesBase64 = await Promise.all(images.map(async (img) => {
          if (img.isKept) {
            return { isKept: true, originalUrl: img.originalUrl }
          } else {
            const base64 = await fileToBase64(img.file)
            return { isKept: false, base64, name: img.file.name }
          }
        }))

        const offlineData = {
          isEditing,
          tipo_original: isEditing ? (editingPost.tipo || 'figura') : null,
          id_original: isEditing ? editingPost.id : null,
          user_id: currentUserId,
          tipo,
          nombre,
          descripcion,
          hashtags: hashtags.length > 0 ? hashtags : null,
          anio: anio || null,
          imagesBase64
        }

        await savePostOffline(offlineData)
        alert('🌐 Sin Conexión: Tu publicación ha sido guardada en la memoria local. Se subirá automáticamente cuando recuperes el internet.')
        onSuccess()
        onClose()
      } catch (err) {
        alert('Error al guardar localmente: ' + err.message)
      } finally {
        setIsSubmitting(false)
      }
      return
    }
    // ==== ONLINE HANDLING ==== //

    const formData = new FormData()
    formData.append('tipo', tipo)
    formData.append('nombre', nombre)
    formData.append('descripcion', descripcion)
    if (hashtags.length > 0) formData.append('hashtags', JSON.stringify(hashtags))
    if (anio) formData.append('anio', anio)

    let url
    if (isEditing) {
      formData.append('id', editingPost.id)
      formData.append('tipo_original', editingPost.tipo || 'figura')
      url = `${API_URL}/auth/editar_post.php`

      const order = []
      let newImageIndex = 0
      images.forEach((img) => {
        if (img.isKept) {
          order.push(img.originalUrl)
        } else {
          order.push(`new_${newImageIndex}`)
          formData.append('images[]', img.file)
          newImageIndex++
        }
      })
      formData.append('media_order', JSON.stringify(order))
      
    } else {
      formData.append('user_id', currentUserId)
      url = `${API_URL}/auth/publicar_post.php`
      
      images.forEach(img => {
        formData.append('images[]', img.file)
      })
    }

    fetch(url, { method: 'POST', body: formData })
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          onSuccess()
          onClose()
        } else {
          alert('Error: ' + (d.error || 'Error desconocido al guardar.'))
        }
      })
      .catch(e => alert(e.message))
      .finally(() => setIsSubmitting(false))
  }

  if (!isOpen) return null

  return (
    <div className="cpm-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) handleClose(); }}>
      <div className="cpm-modal card" style={{ maxWidth: '600px' }}>
        <button className="cpm-close" onClick={handleClose}>&times;</button>
        <h2 className="cpm-title">{isEditing ? '✏️ Editar Publicación' : 'Nueva Publicación'}</h2>

        <form onSubmit={handleSubmit}>
          <div className="cpm-tabs">
            <button type="button" className={`cpm-tab ${tipo === 'figura' ? 'active' : ''}`} onClick={() => setTipo('figura')}>🗿 Figura</button>
            <button type="button" className={`cpm-tab ${tipo === 'cosplay' ? 'active' : ''}`} onClick={() => setTipo('cosplay')}>🎭 Cosplay</button>
          </div>

          <div className="cpm-imgs-container">
            <label className="db-label">Múltiples Imágenes (Arrastra para reordenar)</label>
            <p style={{fontSize:'0.8rem', color:'#aaa', marginBottom:'10px'}}>
              La primera imagen aparecerá como portada. Puedes agregar varias fotos.
            </p>
            
            <div className="cpm-gallery-grid">
              {images.map((img, idx) => (
                <div 
                  key={img.id} 
                  className={`cpm-gallery-item ${idx === 0 ? 'cpm-cover' : ''}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDragEnter={(e) => handleDragEnter(e, idx)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {idx === 0 && <span className="cpm-cover-badge">Portada</span>}
                  <img src={img.url} alt={`img-${idx}`} className="cpm-grid-img"/>
                  <button type="button" className="cpm-remove-img" onClick={() => removeImage(img.id)}>&times;</button>
                </div>
              ))}
              
              <div className="cpm-add-img-btn" onClick={() => fileInputRef.current.click()}>
                <span>➕</span>
                <small>Añadir</small>
              </div>
            </div>

            <input
              type="file"
              accept="image/jpeg, image/png, image/webp"
              multiple
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>

          <div className="admin-form-group" style={{marginTop: '20px'}}>
            <label>{tipo === 'figura' ? 'Nombre de la Figura *' : 'Título del Cosplay / Personaje *'}</label>
            <input type="text" className="admin-input" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej: Naruto Shippuden..." />
          </div>

          <div className="admin-form-group">
            <label>{tipo === 'figura' ? 'Año de Lanzamiento' : 'Año en que se hizo el Cosplay'}</label>
            <input type="number" className="admin-input" value={anio} onChange={e => setAnio(e.target.value)} placeholder="Ej: 2024" />
          </div>

          <div className="admin-form-group">
            <label>Descripción</label>
            <textarea className="admin-input" rows="3" value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Agrega un comentario sobre esta pieza, calidad, escala..."></textarea>
          </div>

          <div className="admin-form-group">
            <label>Serie / Franquicia y Hashtags (Enter para agregar)</label>
            <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '-4px', marginBottom: '8px' }}>
              Recomendamos poner primero el nombre de la franquicia (ej: Star Wars, Bandai) de tu {tipo}.
            </p>
            {hashtags.length > 0 && (
              <div className="cpm-tags-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                {hashtags.map(t => (
                  <span key={t} className="cpm-tag-pill" style={{ background: '#1e4d5a', color: 'white', padding: '4px 8px', borderRadius: '15px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    #{t} <button type="button" onClick={() => removeTag(t)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }}>&times;</button>
                  </span>
                ))}
              </div>
            )}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="admin-input"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onFocus={() => { if(filteredTags.length > 0) setShowSuggestions(true) }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder={tipo === 'figura' ? "Ej: Star Wars, Gundam, Kenner..." : "Ej: Evangelion, Anime, Cosplay..."}
              />
              
              {showSuggestions && (
                <div className="cpm-tag-suggestions">
                  {filteredTags.map(tag => (
                    <div 
                      key={tag} 
                      className="cpm-suggestion-item"
                      onClick={() => addTag(tag)}
                    >
                      #{tag}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="cpm-footer">
            <button type="button" className="btn-outline" onClick={handleClose} disabled={isSubmitting}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : isEditing ? '💾 Guardar Cambios' : 'Publicar 🚀'}
            </button>
          </div>
        </form>

        {showConfirm && (
          <div className="cpm-overlay" style={{ zIndex: 3000, background: 'rgba(0,0,0,0.85)' }}>
            <div className="cpm-modal card" style={{ maxWidth: '400px', textAlign: 'center', padding: '30px' }}>
              <h3 style={{ color: 'white', marginBottom: '16px' }}>¿Cancelar publicación?</h3>
              <p style={{ color: '#aaa', marginBottom: '24px' }}>Si sales ahora, perderás la foto y los textos que ya escribiste.</p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button className="btn-outline" onClick={() => setShowConfirm(false)}>Seguir editando</button>
                <button className="btn-primary" style={{ background: '#d9534f' }} onClick={() => { setShowConfirm(false); onClose(); }}>Descartar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
