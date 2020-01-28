export function createAppStore() {
    return {
        darkMode: true,
        toggleDark() {
            this.darkMode = !this.darkMode;
        },
    };
}

export type TAppStore = ReturnType<typeof createAppStore>;

export default createAppStore;
