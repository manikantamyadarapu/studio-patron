(function(){
    // pricing config (adjustable)
    const pricing = {
      bhk: {"1BHK":250000,"2BHK":350000,"3BHK":450000,"4BHK":550000,"5BHK":650000},
      rooms: { living:40000, kitchen:60000, bedroom:70000, bathroom:50000, dining:45000 },
      packageMultiplier: {"Essentials":1, "Premium":1.3, "Luxury":1.5}
    };

    // helper
    const $ = (sel, ctx=document) => ctx.querySelector(sel);
    const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

    // step elements
    const steps = $$('.step-content');
    const stepNodes = $$('.progress .step');
    let current = 0;

    function showStep(index){
      if(index < 0) index = 0;
      if(index >= steps.length) index = steps.length-1;
      // toggle active
      steps.forEach((s,i) => s.classList.toggle('active', i === index));
      stepNodes.forEach((p,i) => {
        p.classList.toggle('active', i === index);
        p.classList.toggle('completed', i < index);
      });
      current = index;
      // scroll into view
      window.scrollTo({top: document.querySelector('.card').offsetTop - 10, behavior:'smooth'});
    }

    // initial
    showStep(0);

$$('.nextBtn').forEach(btn => btn.addEventListener('click', () => {
  if(!validateStep(current)) return;

  // if current step is 2 (Package), open the form modal next instead of directly showing estimation
  if (current === 2) {
    showStep(3); // move to the next (estimation) step
    setTimeout(() => {
      formOverlay.style.display = 'flex';
      formOverlay.setAttribute('aria-hidden', 'false');
    }, 200);
  } else {
    showStep(current + 1);
  }
}));

    $$('.prevBtn').forEach(btn => btn.addEventListener('click', () => showStep(current - 1)));

    // validate function
    function validateStep(i){
      if(i === 0) {
        if(!document.querySelector("input[name='bhk']:checked")){
          alert("Please select a BHK type to continue.");
          return false;
        }
      }
      if(i === 1) {
        const living = parseInt($('input[name="living"]').value,10);
        const kitchen = parseInt($('input[name="kitchen"]').value,10);
        if(living + kitchen === 0){
          alert("Please select at least one room.");
          return false;
        }
      }
      if(i === 2) {
        if(!document.querySelector("input[name='package']:checked")){
          alert("Please pick a package.");
          return false;
        }
      }
      return true;
    }
// Room Details Modal logic with slide-up effect
const roomModal = document.getElementById("roomDetailsModal");
const openRoomBtn = document.getElementById("openRoomModal");
const closeRoomBtn = document.getElementById("closeRoomModal");

openRoomBtn.addEventListener("click", (e)=>{
  e.preventDefault();
  roomModal.classList.add("active");
  roomModal.setAttribute("aria-hidden", "false");
});

closeRoomBtn.addEventListener("click", ()=>{
  roomModal.classList.remove("active");
  roomModal.setAttribute("aria-hidden", "true");
});

window.addEventListener("click", (e)=>{
  if(e.target === roomModal){
    roomModal.classList.remove("active");
    roomModal.setAttribute("aria-hidden", "true");
  }
});


    // Room increment/decrement behavior
    $$('.inc').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const name = btn.getAttribute('data-name');
        const input = document.querySelector(`input[name="${name}"]`);
        input.value = Math.min(10, Math.max(0, parseInt(input.value || 0) + 1));
      });
    });
    $$('.dec').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const name = btn.getAttribute('data-name');
        const input = document.querySelector(`input[name="${name}"]`);
        input.value = Math.max(0, parseInt(input.value || 0) - 1);
      });
    });


    // open form modal BEFORE showing final estimation
    const formOverlay = $('#formOverlay');
    const openFormBtn = $('#openFormBtn');

    openFormBtn.addEventListener('click', () => {
      // ensure current step is GET QUOTE (3) before opening
      showStep(3);
      setTimeout(()=> { formOverlay.style.display = 'flex'; formOverlay.setAttribute('aria-hidden','false'); }, 120);
    });

    $('#closeForm').addEventListener('click', ()=> {
      formOverlay.style.display = 'none';
    });
    $('#cancelFormBtn').addEventListener('click', ()=> {
      formOverlay.style.display = 'none';
    });

    // Calculate budget function
    function calculateBudget(){
      const bhk = document.querySelector("input[name='bhk']:checked")?.value || '1BHK';
      const pkg = document.querySelector("input[name='package']:checked")?.value || 'Essentials';
      let total = pricing.bhk[bhk] || pricing.bhk['1BHK'];

      // add rooms
      Object.keys(pricing.rooms).forEach(room => {
        const input = document.querySelector(`input[name="${room}"]`);
        if(input) total += (parseInt(input.value || 0) * pricing.rooms[room]);
      });

      // apply package multiplier
      total = Math.round(total * (pricing.packageMultiplier[pkg] || 1));

      // produce a 10% range
      const min = Math.round(total * 0.9);
      const max = Math.round(total * 1.1);

      return {min, max, total, bhk, pkg};
    }

    // format to L (lakhs)
    function formatAsL(amount){
      const l = amount / 100000;
      // show 1 decimal if needed
      if(l % 1 === 0) return `${l.toFixed(0)}L`;
      return `${l.toFixed(1)}L`;
    }

    // On form submit => compute budget and reveal the budget area (not a modal)
    $('#leadForm').addEventListener('submit', (e) => {
      e.preventDefault();

      // basic validation
      const name = $('#nameInput').value.trim();
      const email = $('#emailInput').value.trim();
      const phone = $('#phoneInput').value.trim();
      const property = $('#propertyInput').value.trim();
      const whatsapp = $('#whatsappOpt').checked;

      if(!name || !email || !phone || !property){
        alert('Please fill all fields.');
        return;
      }

      // compute
      const result = calculateBudget();
      const minStr = formatAsL(result.min);
      const maxStr = formatAsL(result.max);

      // fill UI
      $('#budget-range').textContent = `₹${minStr} - ₹${maxStr}*`;
      $('#budgetPlaceholder').classList.add('hidden');
      $('#budgetResult').classList.remove('hidden');

      // optional detailed summary for 'View detailed summary' link:
      $('#viewSummary').onclick = (ev) => {
        ev.preventDefault();
        const details = `
BHK: ${result.bhk}\nPackage: ${result.pkg}\nTotal base estimate: ₹${(result.total).toLocaleString()}
Rooms:
  Living: ${$('input[name="living"]').value}
  Kitchen: ${$('input[name="kitchen"]').value}
  Bedroom: ${$('input[name="bedroom"]').value}
  Bathroom: ${$('input[name="bathroom"]').value}
  Dining: ${$('input[name="dining"]').value}
`;
        alert(details);
      };

      // hide modal and ensure we're on Step 4
      formOverlay.style.display = 'none';
      showStep(3);

      // small UX: focus to budget area
      document.getElementById('budget-range').scrollIntoView({behavior:'smooth', block:'center'});

      // reset form (optional)
      document.getElementById('leadForm').reset();
    });

    // open modal automatically if user reaches step 3 and clicks CTA
    // (openFormBtn already wired). Additionally if user lands on GET QUOTE and wants to open form
    // we'll keep the CTA behavior only.

    // small nicety: clicking package card selects input (visual)
    $$('.pkg').forEach(node=>{
      node.addEventListener('click', ()=> {
        const input = node.querySelector('input');
        if(input) input.checked = true;
        // small visual highlight
        $$('.pkg').forEach(n=>n.style.borderColor = '#f0f0f0');
        node.style.borderColor = 'rgba(107,59,91,0.14)';
      });
    });

    // clicking option box for bhk selects radio
    $$('.option').forEach(opt=>{
      opt.addEventListener('click', ()=> {
        const radio = opt.querySelector('input[type="radio"]');
        if(radio) radio.checked = true;
        // subtle highlight
        $$('.option').forEach(o=>o.style.borderColor='#f0f0f0');
        opt.style.borderColor='rgba(107,59,91,0.12)';
      });
    });

    // allow keyboard Enter to submit modal form
    document.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape' && formOverlay.style.display === 'flex'){
        formOverlay.style.display = 'none';
      }
    });

    // Progress step clicks: allow user to click progress to move (optional)
    stepNodes.forEach((node, idx)=>{
      node.addEventListener('click', ()=> {
        // allow jumping back only
        if(idx <= current+1) {
          showStep(idx);
        }
      });
    });

  })();