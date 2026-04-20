const sampleTransactions = [
  {
    id: 'TXN-2026-0842',
    title: 'Large payment verification required',
    status: 'Pending',
    priority: 'High',
    slaDeadline: Date.now() + 2.25 * 60 * 60 * 1000,
    info: {
      'Customer Name': 'Acme Corporation',
      Amount: '₹ 45,200',
      'Source Category': 'Payment Processing',
      'Assigned To': 'Vikram Seth',
      'Created At': '2026-04-03 08:30:00',
      'Last Updated': '2026-04-03 08:30:00'
    },
    additional: {
      'Priority Level': 'High',
      'Assignment Method': 'System Assigned',
      'Transaction Value': '₹ 45,200'
    },
    history: [
      {
        status: 'In Progress',
        description: 'Started reviewing transaction details',
        actor: 'Vikram Seth',
        timestamp: '2026-04-03 09:15:00'
      },
      {
        status: 'Assigned',
        description: 'Auto-assigned based on workload distribution',
        actor: 'System',
        timestamp: '2026-04-03 08:30:00'
      },
      {
        status: 'Created',
        description: 'Transaction received from Payment Gateway API',
        actor: 'System',
        timestamp: '2026-04-03 08:30:00'
      }
    ],
    docs: [
      { name: 'Priority Level.txt', size: '245 KB' },
      { name: 'customer_kyc_docs.pdf', size: '1.2 MB' }
    ],
    comments: []
  },
  {
    id: 'TXN-2026-0911',
    title: 'Merchant onboarding review',
    status: 'Assigned',
    priority: 'Medium',
    slaDeadline: Date.now() + 6.5 * 60 * 60 * 1000,
    info: {
      'Customer Name': 'Northwind Traders',
      Amount: '₹ 12,900',
      'Source Category': 'Merchant Services',
      'Assigned To': 'Vikram Seth',
      'Created At': '2026-04-03 10:20:00',
      'Last Updated': '2026-04-03 10:45:00'
    },
    additional: {
      'Priority Level': 'Medium',
      'Assignment Method': 'Manual Assignment',
      'Transaction Value': '₹ 12,900'
    },
    history: [
      {
        status: 'Assigned',
        description: 'Assigned by team lead for priority handling',
        actor: 'Team Lead',
        timestamp: '2026-04-03 10:45:00'
      }
    ],
    docs: [{ name: 'merchant_registration.pdf', size: '790 KB' }],
    comments: []
  }
];

const state = {
  transactions: JSON.parse(localStorage.getItem('transactions-demo')) || sampleTransactions,
  selectedTransactionId: 'TXN-2026-0842'
};

const els = {
  search: document.querySelector('#searchInput'),
  transactionId: document.querySelector('#transactionId'),
  transactionTitle: document.querySelector('#transactionTitle'),
  statusBadge: document.querySelector('#statusBadge'),
  priorityBadge: document.querySelector('#priorityBadge'),
  slaTime: document.querySelector('#slaTime'),
  info: document.querySelector('#transactionInfo'),
  additional: document.querySelector('#additionalInfo'),
  history: document.querySelector('#historyList'),
  docs: document.querySelector('#docsList'),
  comments: document.querySelector('#commentList'),
  lastUpdatedText: document.querySelector('#lastUpdatedText'),
  markCompleteBtn: document.querySelector('#markCompleteBtn'),
  referBtn: document.querySelector('#referBtn'),
  commentBtn: document.querySelector('#commentBtn'),
  requestInfoBtn: document.querySelector('#requestInfoBtn'),
  backButton: document.querySelector('#backButton'),
  modal: document.querySelector('#modal'),
  modalForm: document.querySelector('#modalForm'),
  modalTitle: document.querySelector('#modalTitle'),
  modalSubtitle: document.querySelector('#modalSubtitle'),
  modalFields: document.querySelector('#modalFields')
};

function save() {
  localStorage.setItem('transactions-demo', JSON.stringify(state.transactions));
}

function nowStamp() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

function selectedTransaction() {
  return state.transactions.find((t) => t.id === state.selectedTransactionId) || state.transactions[0];
}

function renderPairs(container, pairs) {
  container.innerHTML = '';
  for (const [key, value] of Object.entries(pairs)) {
    const wrapper = document.createElement('div');
    const dt = document.createElement('dt');
    dt.textContent = key;
    const dd = document.createElement('dd');
    dd.textContent = value;
    wrapper.append(dt, dd);
    container.append(wrapper);
  }
}

function renderHistory(history) {
  const tpl = document.querySelector('#timelineItemTemplate');
  els.history.innerHTML = '';
  history.forEach((item) => {
    const node = tpl.content.cloneNode(true);
    node.querySelector('.status').textContent = item.status;
    node.querySelector('.desc').textContent = item.description;
    node.querySelector('.actor').textContent = `By: ${item.actor}`;
    node.querySelector('.timestamp').textContent = item.timestamp;
    els.history.append(node);
  });
}

function renderDocs(docs, tx) {
  els.docs.innerHTML = '';
  docs.forEach((doc) => {
    const li = document.createElement('li');
    const left = document.createElement('div');
    left.innerHTML = `<strong>${doc.name}</strong><br><small>${doc.size}</small>`;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Download';
    btn.onclick = () => {
      const content = `Mock document for ${tx.id}: ${doc.name}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.name;
      a.click();
      URL.revokeObjectURL(url);
    };
    li.append(left, btn);
    els.docs.append(li);
  });
}

function renderComments(comments) {
  els.comments.innerHTML = '';
  if (!comments.length) {
    const li = document.createElement('li');
    li.textContent = 'No comments yet.';
    els.comments.append(li);
    return;
  }
  comments.forEach((comment) => {
    const li = document.createElement('li');
    li.innerHTML = `<div><strong>${comment.author}</strong><br><small>${comment.message}</small></div><time>${comment.timestamp}</time>`;
    els.comments.append(li);
  });
}

function render() {
  const tx = selectedTransaction();
  if (!tx) return;

  els.transactionId.textContent = tx.id;
  els.transactionTitle.textContent = tx.title;
  els.statusBadge.textContent = `• ${tx.status}`;
  els.priorityBadge.textContent = tx.priority;
  renderPairs(els.info, tx.info);
  renderPairs(els.additional, tx.additional);
  renderHistory(tx.history);
  renderDocs(tx.docs, tx);
  renderComments(tx.comments);

  const completed = tx.status === 'Completed';
  [els.markCompleteBtn, els.referBtn, els.requestInfoBtn].forEach((btn) => (btn.disabled = completed));
}

function setLastUpdated() {
  els.lastUpdatedText.textContent = new Date().toLocaleString();
}

function formatSla(deadline) {
  const ms = deadline - Date.now();
  if (ms <= 0) return '• Breached';
  const h = Math.floor(ms / (1000 * 60 * 60));
  const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  return `• ${h}h ${m}m`;
}

function tickSla() {
  const tx = selectedTransaction();
  if (!tx) return;
  els.slaTime.textContent = formatSla(tx.slaDeadline);
}

function prependHistory(tx, status, description, actor = 'Vikram Seth') {
  tx.history.unshift({ status, description, actor, timestamp: nowStamp() });
  tx.info['Last Updated'] = nowStamp();
}

function openModal(config) {
  els.modalTitle.textContent = config.title;
  els.modalSubtitle.textContent = config.subtitle || '';
  els.modalFields.innerHTML = config.fieldsHtml;
  els.modal.showModal();

  els.modalForm.onsubmit = (event) => {
    if (event.submitter?.value === 'cancel') return;
    event.preventDefault();
    const formData = new FormData(els.modalForm);
    config.onConfirm(formData);
    els.modal.close();
  };
}

els.markCompleteBtn.onclick = () => {
  const tx = selectedTransaction();
  if (!tx || tx.status === 'Completed') return;
  tx.status = 'Completed';
  prependHistory(tx, 'Completed', 'Transaction validated and marked complete');
  setLastUpdated();
  save();
  render();
};

els.referBtn.onclick = () => {
  openModal({
    title: 'Refer to Specialist',
    subtitle: 'Escalate this transaction for expert review.',
    fieldsHtml: `
      <label>Specialist
        <select name="specialist" required>
          <option value="Fraud Analyst">Fraud Analyst</option>
          <option value="Compliance Officer">Compliance Officer</option>
          <option value="Risk Lead">Risk Lead</option>
        </select>
      </label>
      <label>Reason
        <textarea name="reason" rows="3" required placeholder="Explain why this needs escalation"></textarea>
      </label>
    `,
    onConfirm(formData) {
      const tx = selectedTransaction();
      const specialist = formData.get('specialist');
      const reason = formData.get('reason');
      tx.status = 'Referred';
      tx.info['Assigned To'] = specialist;
      prependHistory(tx, 'Referred', `Escalated to ${specialist}: ${reason}`);
      save();
      setLastUpdated();
      render();
    }
  });
};

els.commentBtn.onclick = () => {
  openModal({
    title: 'Add Comment',
    subtitle: 'Add an internal note to this transaction.',
    fieldsHtml: `
      <label>Comment
        <textarea name="message" rows="4" required placeholder="Type your comment"></textarea>
      </label>
    `,
    onConfirm(formData) {
      const message = formData.get('message')?.toString().trim();
      if (!message) return;
      const tx = selectedTransaction();
      tx.comments.unshift({
        author: 'Vikram Seth',
        message,
        timestamp: nowStamp()
      });
      prependHistory(tx, 'Comment Added', 'Internal comment captured for audit trail');
      save();
      setLastUpdated();
      render();
    }
  });
};

els.requestInfoBtn.onclick = () => {
  openModal({
    title: 'Request Additional Information',
    subtitle: 'Send a request back to the customer or upstream team.',
    fieldsHtml: `
      <label>Requested From
        <select name="source" required>
          <option value="Customer">Customer</option>
          <option value="Payment Gateway">Payment Gateway</option>
          <option value="Relationship Manager">Relationship Manager</option>
        </select>
      </label>
      <label>Required Details
        <textarea name="details" rows="4" required placeholder="Describe the information needed"></textarea>
      </label>
    `,
    onConfirm(formData) {
      const source = formData.get('source');
      const details = formData.get('details');
      const tx = selectedTransaction();
      tx.status = 'Info Requested';
      prependHistory(tx, 'Info Requested', `${source}: ${details}`);
      save();
      setLastUpdated();
      render();
    }
  });
};

els.search.oninput = (event) => {
  const query = event.target.value.trim().toLowerCase();
  if (!query) {
    state.selectedTransactionId = sampleTransactions[0].id;
    render();
    return;
  }

  const found = state.transactions.find((tx) => {
    const blob = [
      tx.id,
      tx.title,
      tx.status,
      tx.priority,
      ...Object.values(tx.info),
      ...tx.history.map((h) => h.description)
    ]
      .join(' ')
      .toLowerCase();
    return blob.includes(query);
  });

  if (found) {
    state.selectedTransactionId = found.id;
    render();
  }
};

els.backButton.onclick = () => {
  alert('Navigate back to Assigned Tasks list (hook to router in production).');
};

setLastUpdated();
render();
tickSla();
setInterval(tickSla, 30_000);
