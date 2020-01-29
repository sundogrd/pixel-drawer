import * as React from 'react';
import './index.css';
import { useLogger } from 'react-use';
import { useLocalStore, observer } from 'mobx-react';

type NumberInputProps = {
    label: string;
    value: number;
    onChange: (number: number) => void;
};

const NumberInput: React.FunctionComponent<NumberInputProps> = observer(
    ({ label, value, onChange }) => {
        useLogger('NumberInput', {
            label: label,
            value: value,
        });

        const store = useLocalStore(() => ({
            value: value.toString(),
            setValue(value: string) {
                this.value = value;
            },
            get submitValue(): number {
                const parsedInt = parseInt(this.value, 10);
                if (!Number.isNaN(parsedInt)) {
                    return parsedInt;
                }
                return value;
            },
        }));

        React.useEffect(() => {
            store.setValue(value.toString());
        }, [value]);

        const handleValueSubmit = () => {};

        return (
            <div className="number-input">
                <label htmlFor="number-input__input">
                    {label}
                    <input
                        type="number"
                        value={store.value}
                        onChange={(event): void => {
                            store.setValue(event.target.value);
                            return;
                        }}
                        onKeyDown={e => {
                            if (store.submitValue === value) {
                                return;
                            }
                            if (e.charCode == 13) {
                                onChange(store.submitValue);
                            }
                            if (e.keyCode == 13) {
                                onChange(store.submitValue);
                            }
                        }}
                        onBlur={() => {
                            if (store.submitValue !== value) {
                                onChange(store.submitValue);
                            }
                        }}
                        id="number-input__input"
                    />
                </label>
            </div>
        );
    },
);

export default NumberInput;
