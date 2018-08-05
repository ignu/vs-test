let lastTest: string | null = null;
const save = (testName: string) => (lastTest = testName);

const load = () => lastTest;

export default { save, load };
