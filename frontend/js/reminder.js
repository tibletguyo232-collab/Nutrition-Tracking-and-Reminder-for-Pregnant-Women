
  ;(() => {
    const $ = (sel, root=document) => root.querySelector(sel)
    const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel))

    const STORAGE_KEY = 'reminders.v1'

    const state = {
      reminders: [],
      filter: { q:'', category:'', status:'' },
      timers: new Map(), 
    }

    const uid = () => Math.random().toString(36).slice(2, 9)
    const fmtDate = iso => new Date(iso).toLocaleString([], {hour:'2-digit', minute:'2-digit', year:'numeric', month:'short', day:'2-digit'})
    const isToday = iso => {
      const d = new Date(iso), n = new Date()
      return d.getFullYear()===n.getFullYear() && d.getMonth()===n.getMonth() && d.getDate()===n.getDate()
    }
    const nowISO = () => new Date().toISOString()

    // Persistence 
    function load(){
      try{ state.reminders = JSON.parse(localStorage.getItem(STORAGE_KEY)) || seed() }catch(e){ state.reminders = seed() }
    }
    function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state.reminders)) }

    function seed(){
      const base = new Date()
      const sample = [
        { id:uid(), title:'Take prenatal vitamin', category:'Medication', datetime:new Date(base.getTime()+60*60*1000).toISOString(), repeat:'daily', channel:'push', notes:'With breakfast', completed:false },
        { id:uid(), title:'Drink a glass of water', category:'Hydration', datetime:new Date(base.getTime()+30*60*1000).toISOString(), repeat:'hourly', channel:'push', notes:'Goal: 8 glasses/day', completed:false },
        { id:uid(), title:'Light walk', category:'Exercise', datetime:new Date(base.getTime()+2*60*60*1000).toISOString(), repeat:'daily', channel:'push', notes:'10–15 minutes', completed:false },
      ]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sample))
      return sample
    }

    function scheduleAll(){
      // clear existing
      state.timers.forEach(t => clearTimeout(t)); state.timers.clear()
      state.reminders.filter(r=>!r.completed).forEach(scheduleOne)
    }

    function scheduleOne(r){
      const when = new Date(r.datetime).getTime() - Date.now()
      if (when <= 0) return 
      const t = setTimeout(()=>{
        maybeNotify(r)
      }, Math.min(when, 2**31-1)) 
      state.timers.set(r.id, t)
    }

    function maybeNotify(r){
      if (r.channel === 'push' && 'Notification' in window){
        if (Notification.permission === 'granted'){
          new Notification('Reminder: ' + r.title, { body:`${r.category} • ${fmtDate(r.datetime)}`, tag:r.id })
        }
      }
    }

    //  Rendering 
    function render(){
      const listEl = $('#list')
      listEl.innerHTML = ''

      const filtered = state.reminders.filter(r=>{
        const q = state.filter.q.toLowerCase()
        const matchQ = !q || r.title.toLowerCase().includes(q) || (r.notes||'').toLowerCase().includes(q)
        const matchCat = !state.filter.category || r.category === state.filter.category
        const now = Date.now()
        const overdue = !r.completed && new Date(r.datetime).getTime() < now
        const status = r.completed ? 'done' : overdue ? 'overdue' : 'pending'
        const matchStatus = !state.filter.status || state.filter.status===status
        return matchQ && matchCat && matchStatus
      }).sort((a,b)=> new Date(a.datetime) - new Date(b.datetime))

      if (!filtered.length){
        listEl.appendChild($('#emptyTpl').content.cloneNode(true))
      } else {
        for (const r of filtered){
          const overdue = !r.completed && new Date(r.datetime).getTime() < Date.now()
          const dueSoon = !r.completed && !overdue && (new Date(r.datetime).getTime() - Date.now()) < 30*60*1000
          const item = document.createElement('div')
          item.className = 'item' + (r.completed ? ' done' : '')
          item.setAttribute('data-id', r.id)
          item.innerHTML = `
            <div class="left">
              <div class="pill" aria-hidden="true">${iconFor(r.category)}</div>
              <div>
                <div class="title">${escapeHTML(r.title)}</div>
                <div class="meta ${overdue? 'overdue':''} ${dueSoon? 'due-soon':''}">
                  ${r.category} • ${fmtDate(r.datetime)} ${isToday(r.datetime) ? '(today)': ''}
                </div>
                ${r.notes ? `<div class="muted" style="font-size:13px; margin-top:4px">${escapeHTML(r.notes)}</div>`:''}
              </div>
            </div>
            <div class="actions">
              ${!r.completed ? `<button data-act="done" class="primary">Mark done</button>` : ''}
              <button data-act="snooze" title="Snooze 10 min">Snooze</button>
              <button data-act="edit">Edit</button>
              <button data-act="delete">Delete</button>
            </div>`
          listEl.appendChild(item)
        }
      }

      updateProgress()
      renderCalendar()
    }

    function iconFor(cat){
      return {Nutrition:'🍎', Hydration:'💧', Medication:'💊', Appointment:'🩺', Exercise:'🧘'}[cat] || '⏰'
    }

    function escapeHTML(str){
      return str.replace(/[&<>"']/g, m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]))
    }

    function updateProgress(){
      const today = state.reminders.filter(r=> isToday(r.datetime))
      const done = today.filter(r=> r.completed)
      const pct = today.length ? Math.round((done.length / today.length) * 100) : 0
      $('#progressBar').style.width = pct + '%'
      $('.progress').setAttribute('aria-valuenow', pct)
      $('#progressText').textContent = `${done.length}/${today.length}`
    }

    function renderCalendar(){
      const cal = $('#calendar')
      cal.innerHTML = ''
      const now = new Date()
      const first = new Date(now.getFullYear(), now.getMonth(), 1)
      const last = new Date(now.getFullYear(), now.getMonth()+1, 0)
      for (let d=1; d<=last.getDate(); d++){
        const day = document.createElement('div')
        day.className = 'day'
        const date = new Date(now.getFullYear(), now.getMonth(), d)
        const has = state.reminders.some(r=>{
          const rd = new Date(r.datetime)
          return rd.getFullYear()===date.getFullYear() && rd.getMonth()===date.getMonth() && rd.getDate()===date.getDate()
        })
        day.textContent = d + (has ? ' •' : '')
        if (date.toDateString() === new Date().toDateString()) day.classList.add('today')
        cal.appendChild(day)
      }
    }

    // CRUD 
    function upsert(rem){
      const idx = state.reminders.findIndex(r=> r.id===rem.id)
      if (idx>-1) state.reminders[idx] = rem; else state.reminders.push(rem)
      save(); render(); scheduleAll()
    }

    function remove(id){
      state.reminders = state.reminders.filter(r=> r.id!==id)
      save(); render(); scheduleAll()
    }

    //Event Listeners
    $('#addBtn').addEventListener('click', () => openModal())
    $('#closeModal').addEventListener('click', closeModal)
    $('#cancelBtn').addEventListener('click', closeModal)

    $('#reminderForm').addEventListener('submit', e => {
      e.preventDefault()
      const id = $('#reminderId').value || uid()
      const rem = {
        id,
        title: $('#title').value.trim(),
        category: $('#category').value,
        datetime: new Date($('#datetime').value).toISOString(),
        repeat: $('#repeat').value,
        channel: $('#channel').value,
        notes: $('#notes').value.trim(),
        completed: false,
      }
      upsert(rem)
      closeModal()
    })

    $('#list').addEventListener('click', e => {
      const btn = e.target.closest('button')
      if (!btn) return
      const item = e.target.closest('.item')
      const id = item.getAttribute('data-id')
      const r = state.reminders.find(x=> x.id===id)
      const act = btn.dataset.act
      if (act==='done'){ r.completed = true; upsert(r) }
      if (act==='delete'){ remove(id) }
      if (act==='edit'){ openModal(r) }
      if (act==='snooze'){
        const dt = new Date(r.datetime).getTime() + 10*60*1000
        r.datetime = new Date(dt).toISOString(); r.completed=false; upsert(r)
      }
    })

    $('#search').addEventListener('input', e=>{ state.filter.q = e.target.value; render() })
    $('#filterCategory').addEventListener('change', e=>{ state.filter.category = e.target.value; render() })
    $('#filterStatus').addEventListener('change', e=>{ state.filter.status = e.target.value; render() })

    $('#notifyBtn').addEventListener('click', async ()=>{
      if (!('Notification' in window)) return alert('Notifications not supported in this browser.')
      const perm = await Notification.requestPermission()
      if (perm==='granted') new Notification('Notifications enabled ✔️', { body:'You will get reminder alerts on this device.' })
    })

    $('#quickHydration').addEventListener('click', ()=>{
      const dt = new Date(Date.now() + 15*60*1000)
      openModal({ title:'Drink a glass of water', category:'Hydration', datetime: dt.toISOString(), repeat:'daily', channel:'push', notes:'Goal: 8 glasses/day' })
    })

    function openModal(data){
      $('#modalTitle').textContent = data && data.id ? 'Edit Reminder' : 'Add Reminder'
      $('#reminderId').value = data?.id || ''
      $('#title').value = data?.title || ''
      $('#category').value = data?.category || 'Nutrition'
      $('#datetime').value = (data?.datetime ? new Date(data.datetime) : new Date(Date.now()+30*60*1000)).toISOString().slice(0,16)
      $('#repeat').value = data?.repeat || 'once'
      $('#channel').value = data?.channel || 'push'
      $('#notes').value = data?.notes || ''
      $('#modal').showModal()
    }
    function closeModal(){ $('#modal').close() }

    //  Init
    load(); render(); scheduleAll()
  })()
  let token = localStorage.getItem("token");

// Login
async function login(email, password) {
  const res = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  localStorage.setItem("token", data.token);
  token = data.token;
}

// Load reminders (authenticated)
async function loadReminders() {
  const res = await fetch("http://localhost:5000/api/reminders", {
    headers: { "Authorization": "Bearer " + token }
  });
  const data = await res.json();
  console.log(data);
}
