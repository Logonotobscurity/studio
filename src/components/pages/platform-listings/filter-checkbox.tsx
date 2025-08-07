'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type FilterCheckboxProps = {
  id: string;
  paramName: string;
  value: string;
  label: string;
};

export default function FilterCheckbox({ id, paramName, value, label }: FilterCheckboxProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (paramsToUpdate: { [key: string]: string[] }) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(paramsToUpdate).forEach(([name, values]) => {
        params.delete(name);
        values.forEach(val => params.append(name, val));
      });
      return params.toString();
    },
    [searchParams]
  );

  const isChecked = searchParams.getAll(paramName).includes(value);

  const handleCheckedChange = (checked: boolean | 'indeterminate') => {
    const currentValues = new Set(searchParams.getAll(paramName));
    if (checked) {
      currentValues.add(value);
    } else {
      currentValues.delete(value);
    }
    const newQueryString = createQueryString({ [paramName]: Array.from(currentValues) });
    router.push(`${pathname}?${newQueryString}`);
  };

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={id}
        checked={isChecked}
        onCheckedChange={handleCheckedChange}
      />
      <Label htmlFor={id} className="font-normal text-sm cursor-pointer">
        {label}
      </Label>
    </div>
  );
}
