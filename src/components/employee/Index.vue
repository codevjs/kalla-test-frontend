<script lang="ts" setup>
import { useStoreEmployee } from '@/stores/employee.store';
import { onUnmounted } from 'vue';

const store = useStoreEmployee();

onUnmounted(() => {
    store.fetchEmployees();
});
</script>

<template>
    <div class="overflow-y-hidden h-screen">
        <main class="mt-0 transition-all duration-200 ease-soft-in-out h-full">
            <section class="h-full p-4">
                <!-- Curved image -->
                <div
                    class="relative flex items-center overflow-hidden bg-center bg-cover h-full rounded-xl"
                    style="background-image: url('curved-images/curved14.jpg')"
                >
                    <span
                        class="absolute top-0 left-0 w-full h-full bg-center bg-cover bg-gradient-to-tl from-gray-900 to-slate-800 opacity-60"
                    >
                    </span>
                    <div class="container">
                        <div class="flex flex-wrap">
                            <div class="w-full max-w-full px-3 mx-auto mt-0 md:flex-0 shrink-0">
                                <div
                                    class="relative z-0 flex flex-col min-w-0 break-words bg-white border-0 shadow-soft-xl rounded-2xl bg-clip-border"
                                >
                                    <div class="w-full b-white p-4"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </div>
</template>
