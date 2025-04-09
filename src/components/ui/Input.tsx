import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
	return (
		<input
			type={type}
			data-slot="input"
			className={cn(
				'placeholder:text-[#BDBDBD] flex w-full mt-2 px-2 min-w-0 rounded-md border !border-[#E0E0E0] bg-transparent py-2 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
				className
			)}
			{...props}
		/>
	)
}

export { Input }
