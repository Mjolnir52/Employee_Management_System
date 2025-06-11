document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const employeeForm = document.getElementById('employeeForm');
    const employeeTableBody = document.getElementById('employeeTableBody');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const resetSearchBtn = document.getElementById('resetSearchBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    
    // Employee data (in a real app, this would come from a server/database)
    let employees = JSON.parse(localStorage.getItem('employees')) || [];
    let isEditing = false;
    let currentEmployeeId = null;
    
    // Initialize the app
    renderEmployeeTable();
    
    // Form submission
    employeeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const employeeData = {
            id: isEditing ? currentEmployeeId : Date.now().toString(),
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            department: document.getElementById('department').value,
            position: document.getElementById('position').value,
            salary: document.getElementById('salary').value,
            hireDate: document.getElementById('hireDate').value
        };
        
        if (isEditing) {
            // Update existing employee
            const index = employees.findIndex(emp => emp.id === currentEmployeeId);
            if (index !== -1) {
                employees[index] = employeeData;
            }
        } else {
            // Add new employee
            employees.push(employeeData);
        }
        
        // Save to localStorage
        localStorage.setItem('employees', JSON.stringify(employees));
        
        // Reset form and update table
        resetForm();
        renderEmployeeTable();
    });
    
    // Cancel button
    cancelBtn.addEventListener('click', resetForm);
    
    // Search functionality
    searchBtn.addEventListener('click', function() {
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            const filteredEmployees = employees.filter(emp => 
                emp.name.toLowerCase().includes(searchTerm) || 
                emp.email.toLowerCase().includes(searchTerm) ||
                emp.department.toLowerCase().includes(searchTerm) ||
                emp.position.toLowerCase().includes(searchTerm)
            );
            renderEmployeeTable(filteredEmployees);
        }
    });
    
    // Reset search
    resetSearchBtn.addEventListener('click', function() {
        searchInput.value = '';
        renderEmployeeTable();
    });
    
    // Render employee table
    function renderEmployeeTable(data = employees) {
        employeeTableBody.innerHTML = '';
        
        if (data.length === 0) {
            employeeTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No employees found</td></tr>';
            return;
        }
        
        data.forEach(employee => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${employee.name}</td>
                <td>${employee.email}</td>
                <td>${employee.department}</td>
                <td>${employee.position}</td>
                <td>
                    <button class="action-btn edit-btn" data-id="${employee.id}">Edit</button>
                    <button class="action-btn delete-btn" data-id="${employee.id}">Delete</button>
                </td>
            `;
            
            employeeTableBody.appendChild(row);
        });
        
        // Add event listeners to edit and delete buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', handleEdit);
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', handleDelete);
        });
    }
    
    // Handle edit
    function handleEdit(e) {
        const employeeId = e.target.getAttribute('data-id');
        const employee = employees.find(emp => emp.id === employeeId);
        
        if (employee) {
            isEditing = true;
            currentEmployeeId = employeeId;
            
            // Fill the form with employee data
            document.getElementById('employeeId').value = employee.id;
            document.getElementById('name').value = employee.name;
            document.getElementById('email').value = employee.email;
            document.getElementById('phone').value = employee.phone;
            document.getElementById('department').value = employee.department;
            document.getElementById('position').value = employee.position;
            document.getElementById('salary').value = employee.salary;
            document.getElementById('hireDate').value = employee.hireDate;
            
            // Scroll to form
            document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    // Handle delete
    function handleDelete(e) {
        if (confirm('Are you sure you want to delete this employee?')) {
            const employeeId = e.target.getAttribute('data-id');
            employees = employees.filter(emp => emp.id !== employeeId);
            
            // Save to localStorage and update table
            localStorage.setItem('employees', JSON.stringify(employees));
            renderEmployeeTable();
            
            // If we were editing this employee, reset the form
            if (isEditing && currentEmployeeId === employeeId) {
                resetForm();
            }
        }
    }
    
    // Reset form
    function resetForm() {
        employeeForm.reset();
        document.getElementById('employeeId').value = '';
        isEditing = false;
        currentEmployeeId = null;
    }
});