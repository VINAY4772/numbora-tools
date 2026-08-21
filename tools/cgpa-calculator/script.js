function initCGPACalculator() {
  const container = document.getElementById('subjects-container');
  const addBtn = document.getElementById('add-subject-btn');
  const multInput = document.getElementById('multiplier');

  const resCgpa = document.getElementById('res-cgpa');
  const resPct = document.getElementById('res-pct');
  const resCredits = document.getElementById('res-credits');
  const resClass = document.getElementById('res-class');

  const btnScale10 = document.getElementById('btn-scale-10');
  const btnScale4 = document.getElementById('btn-scale-4');

  const targetGoalInput = document.getElementById('target-cgpa-goal');
  const remainingCredsInput = document.getElementById('remaining-credits');
  const reqGpaVal = document.getElementById('req-gpa-val');
  const targetPlannerResult = document.getElementById('target-planner-result');

  let currentScale = '10'; // '10' or '4'

  const GRADES_10 = [
    { val: '10', label: 'S (Superior) - 10 Pts' },
    { val: '9', label: 'A (Excellent) - 9 Pts' },
    { val: '8', label: 'B (Very Good) - 8 Pts' },
    { val: '7', label: 'C (Good) - 7 Pts' },
    { val: '6', label: 'D (Average) - 6 Pts' },
    { val: '5', label: 'E (Pass) - 5 Pts' },
    { val: '0', label: 'F (Fail) - 0 Pts' }
  ];

  const GRADES_4 = [
    { val: '4.0', label: 'A (4.0)' },
    { val: '3.7', label: 'A- (3.7)' },
    { val: '3.3', label: 'B+ (3.3)' },
    { val: '3.0', label: 'B (3.0)' },
    { val: '2.7', label: 'B- (2.7)' },
    { val: '2.3', label: 'C+ (2.3)' },
    { val: '2.0', label: 'C (2.0)' },
    { val: '1.0', label: 'D (1.0)' },
    { val: '0.0', label: 'F (0.0)' }
  ];

  function getGradeOptions() {
    const list = currentScale === '10' ? GRADES_10 : GRADES_4;
    return list.map(g => `<option value="${g.val}">${g.label}</option>`).join('');
  }

  function createRow(name = '', credits = 3, gradeVal = null) {
    const row = document.createElement('div');
    row.className = 'subject-row';
    row.style.cssText = 'display: grid; grid-template-columns: 2fr 1fr 2fr 40px; gap: 8px; align-items: center; margin-bottom: 10px;';
    
    const count = container.querySelectorAll('.subject-row').length + 1;
    const defaultName = name || `Subject ${count}`;

    row.innerHTML = `
      <input type="text" class="input-control subj-name" value="${defaultName}" />
      <input type="number" class="input-control subj-credits" value="${credits}" min="0" max="20" placeholder="Credits" />
      <select class="input-control subj-grade">${getGradeOptions()}</select>
      <button class="btn-danger remove-btn" style="padding: 8px; border-radius: var(--radius-md); cursor: pointer;" title="Remove Subject">✕</button>
    `;

    if (gradeVal) {
      const select = row.querySelector('.subj-grade');
      if (select) select.value = gradeVal;
    }

    const removeBtn = row.querySelector('.remove-btn');
    removeBtn.onclick = () => {
      if (container.querySelectorAll('.subject-row').length > 1) {
        row.remove();
        
  if (resCgpa) resCgpa.textContent = '0.00';
  if (resCredits) resCredits.textContent = '0';
  if (resPct) resPct.textContent = '0.00%';
  if (resClass) {
    resClass.textContent = 'Enter course credits & grades';
    resClass.style.color = 'var(--text-muted)';
    resClass.style.background = 'var(--bg-input)';
  }

      }
    };

    const inputs = row.querySelectorAll('input, select');
    inputs.forEach(input => {
      input.oninput = calculateCGPA;
      input.onchange = calculateCGPA;
    });

    return row;
  }

  function updateGradeDropdowns() {
    const rows = container.querySelectorAll('.subject-row');
    rows.forEach(row => {
      const select = row.querySelector('.subj-grade');
      if (select) {
        select.innerHTML = getGradeOptions();
      }
    });
  }

  if (btnScale10 && btnScale4) {
    btnScale10.onclick = () => {
      currentScale = '10';
      btnScale10.classList.add('btn-primary');
      btnScale10.classList.remove('btn-secondary');
      btnScale4.classList.remove('btn-primary');
      btnScale4.classList.add('btn-secondary');
      if (multInput) multInput.value = '9.5';
      if (targetGoalInput) targetGoalInput.value = '9.0';
      updateGradeDropdowns();
      calculateCGPA();
    };

    btnScale4.onclick = () => {
      currentScale = '4';
      btnScale4.classList.add('btn-primary');
      btnScale4.classList.remove('btn-secondary');
      btnScale10.classList.remove('btn-primary');
      btnScale10.classList.add('btn-secondary');
      if (multInput) multInput.value = '25';
      if (targetGoalInput) targetGoalInput.value = '3.5';
      updateGradeDropdowns();
      calculateCGPA();
    };
  }

  if (addBtn) {
    addBtn.onclick = () => {
      const newRow = createRow('', 3);
      container.appendChild(newRow);
      calculateCGPA();
    };
  }

  function calculateCGPA() {
    const rows = container.querySelectorAll('.subject-row');
    let totalCredits = 0;
    let totalGradePoints = 0;

    rows.forEach(row => {
      const credInput = row.querySelector('.subj-credits');
      const gradeSelect = row.querySelector('.subj-grade');

      const credits = parseFloat(credInput?.value) || 0;
      let gradePts = 0;
      const rawGrade = gradeSelect?.value || '0';
      if (rawGrade.includes('-')) {
        gradePts = parseFloat(rawGrade.split('-')[0]) || 0;
      } else {
        gradePts = parseFloat(rawGrade) || 0;
      }

      totalCredits += credits;
      totalGradePoints += (credits * gradePts);
    });

    const cgpa = totalCredits > 0 ? (totalGradePoints / totalCredits) : 0;
    const mult = parseFloat(multInput?.value) || 9.5;
    const percentage = cgpa * mult;

    if (resCgpa) resCgpa.textContent = cgpa.toFixed(2);
    if (resCredits) resCredits.textContent = totalCredits.toString();
    if (resPct) resPct.textContent = Math.min(100, percentage).toFixed(2) + '%';

    // Award class classification
    if (resClass) {
      if (currentScale === '10') {
        if (cgpa >= 7.5) {
          resClass.textContent = 'First Class with Distinction 🏆';
          resClass.style.color = '#059669';
          resClass.style.background = 'rgba(5, 150, 105, 0.12)';
        } else if (cgpa >= 6.5) {
          resClass.textContent = 'First Class ⭐';
          resClass.style.color = '#10b981';
          resClass.style.background = 'rgba(16, 185, 129, 0.12)';
        } else if (cgpa >= 5.5) {
          resClass.textContent = 'Second Class 👍';
          resClass.style.color = '#0284c7';
          resClass.style.background = 'rgba(2, 132, 199, 0.12)';
        } else if (cgpa >= 5.0) {
          resClass.textContent = 'Pass Class ✅';
          resClass.style.color = '#d97706';
          resClass.style.background = 'rgba(217, 119, 6, 0.12)';
        } else {
          resClass.textContent = 'Needs Improvement ⚠️';
          resClass.style.color = '#e11d48';
          resClass.style.background = 'rgba(225, 29, 72, 0.12)';
        }
      } else {
        if (cgpa >= 3.7) resClass.textContent = 'Summa Cum Laude 🏆';
        else if (cgpa >= 3.5) resClass.textContent = 'Magna Cum Laude ⭐';
        else if (cgpa >= 3.0) resClass.textContent = 'Cum Laude 👍';
        else resClass.textContent = 'Good Standing ✅';
        resClass.style.color = '#059669';
        resClass.style.background = 'rgba(5, 150, 105, 0.12)';
      }
    }

    // Target Planner
    calculateTargetPlanner(cgpa, totalCredits);
  }

  function calculateTargetPlanner(curCgpa, curCredits) {
    const goalCgpa = parseFloat(targetGoalInput?.value) || 0;
    const remCredits = parseFloat(remainingCredsInput?.value) || 0;

    if (remCredits <= 0 || !reqGpaVal) return;

    const totalNeededPts = goalCgpa * (curCredits + remCredits);
    const curPts = curCgpa * curCredits;
    const reqPts = totalNeededPts - curPts;
    const reqGpa = reqPts / remCredits;

    const maxScale = currentScale === '10' ? 10.0 : 4.0;

    if (reqGpa > maxScale) {
      reqGpaVal.textContent = `${reqGpa.toFixed(2)} (⚠️ Mathematically impossible with remaining credits)`;
      reqGpaVal.style.color = 'var(--accent-rose)';
    } else if (reqGpa <= 0) {
      reqGpaVal.textContent = `0.00 (Goal already secured! 🎉)`;
      reqGpaVal.style.color = 'var(--primary)';
    } else {
      reqGpaVal.textContent = `${reqGpa.toFixed(2)} / ${maxScale}`;
      reqGpaVal.style.color = 'var(--primary)';
    }
  }

  if (multInput) multInput.oninput = calculateCGPA;
  if (targetGoalInput) targetGoalInput.oninput = calculateCGPA;
  if (remainingCredsInput) remainingCredsInput.oninput = calculateCGPA;

  // Bind initial rows
  const initialRows = container.querySelectorAll('.subject-row');
  initialRows.forEach(row => {
    const removeBtn = row.querySelector('.remove-btn');
    if (removeBtn) {
      removeBtn.onclick = () => {
        if (container.querySelectorAll('.subject-row').length > 1) {
          row.remove();
          calculateCGPA();
        }
      };
    }
    const inputs = row.querySelectorAll('input, select');
    inputs.forEach(input => {
      input.oninput = calculateCGPA;
      input.onchange = calculateCGPA;
    });
  });

  calculateCGPA();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCGPACalculator);
} else {
  initCGPACalculator();
}

window.addEventListener('load', initCGPACalculator);
