import { IEmployee } from '@/interface/employee.interface';
import { RequestBuilder } from '@/utils/fetch.utils';
import { defineStore } from 'pinia';

export const useStoreEmployee = defineStore('employee-store', {
    state: () => ({
        loading: false,
        employees: [] as IEmployee[],
    }),
    actions: {
        async fetchEmployees() {
            try {
                this.loading = true;

                const request = new RequestBuilder();

                const response = await request.get('/employees');

                const { data } = response.data;

                console.log(data);

                this.employees = data;
            } catch (error) {
                if (error instanceof Error) {
                    console.error(error.message);
                }
            } finally {
                this.loading = false;
            }
        },
    },
});
