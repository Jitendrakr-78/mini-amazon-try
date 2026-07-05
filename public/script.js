const studentForm = document.getElementById('studentForm');
const showBtn = document.getElementById('showBtn');
const tableBody = document.getElementById('studentTableBody');

// 1. Save Button Logic
studentForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const studentData = {
        name: document.getElementById('name').value,
        studentClass: document.getElementById('studentClass').value,
        age: parseInt(document.getElementById('age').value),
        majorSubject: document.getElementById('majorSubject').value,
        hobby: document.getElementById('hobby').value
    };

    try {
        const response = await fetch('/api/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentData)
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            studentForm.reset();
        } else {
            alert('Error: ' + result.error);
        }
    } catch (error) {
        console.error('Error saving data:', error);
        alert('Server connect nahi ho pa raha hai.');
    }
});

// 2. Show Button Logic
showBtn.addEventListener('click', async () => {
    try {
        const response = await fetch('/api/students');
        const data = await response.json();

        if (response.ok) {
            tableBody.innerHTML = ''; // Purana data clear karne ke liye
            
            if(data.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No records found</td></tr>`;
                return;
            }

            data.forEach(student => {
                const row = `
                    <tr>
                        <td>${student.id}</td>
                        <td>${student.name}</td>
                        <td>${student.class}</td>
                        <td>${student.age}</td>
                        <td>${student.major_subject}</td>
                        <td>${student.hobby}</td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
        } else {
            alert('Error fetching data: ' + data.error);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Server se data fetch nahi ho paya.');
    }
});
