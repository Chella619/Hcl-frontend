export interface Employees {
    limit: number;
    page: number;
    total: number;
    employees: Employee[]
}

export interface Employee {
    delegate_id: string;
    employee_id: string;
    recordes: Records;
}

interface Records {
    delegate_id: string;
    first_name: string;
    found: string;
    last_name: string;
}