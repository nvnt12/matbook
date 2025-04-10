import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Checkbox } from '@/components/ui/Checkbox'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/Form'
import { FaApple, FaFacebook } from 'react-icons/fa'
import { Label } from '@/components/ui/Label'
import { FcGoogle } from 'react-icons/fc'

const formSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
	rememberMe: z.boolean()
})

type FormData = z.infer<typeof formSchema>

export default function LoginPage() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: 'demo@email.com',
			password: 'demo1234',
			rememberMe: false
		}
	})

	async function onSubmit(values: FormData) {
		setIsLoading(true)

		try {
			const res = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: values.email,
					password: values.password
				})
			})

			const data = await res.json()

			if (!res.ok) {
				throw new Error(data.error || 'Something went wrong')
			}

			// Store token in localStorage
			localStorage.setItem('token', data.token)

			router.push('/workflow-list')
		} catch (error) {
			if (error instanceof Error) {
				console.error('Login error:', error.message)
				alert(error.message)
			} else {
				console.error('Unexpected error:', error)
				alert('An unexpected error occurred')
			}
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="min-h-screen h-full w-full relative bg-white text-black overflow-clip">
			<Image
				src={'/assets/bg-img.png'}
				alt="Background Image"
				className="h-full w-full object-cover object-center"
				fill
				priority
			/>
			<div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/70 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-40 pt-6 px-4">
				<div className="flex flex-col gap-6 sm:gap-10 md:gap-16 lg:gap-24 justify-end lg:justify-center items-center lg:items-end">
					<div className="flex w-full max-w-sm lg:w-md justify-center md:justify-start items-center gap-2 text-white">
						<Image src="/assets/logo.svg" alt="Logo" width={270} height={64} className=' w-36 md:w-48 lg:w-52' />
					</div>
					<div className=" w-full max-w-sm lg:w-md text-white">
						<h1 className=" text-2xl md:text-3xl lg:text-4xl text-center md:text-left font-bold mb-4">Building the Future...</h1>
						<p className="hidden md:block text-sm lg:text-base font-light">
							Manage tasks effortlessly with an interactive editor, real-time
							tracking, secure authentication, and seamless API integration—all in one
							place.
						</p>
					</div>
				</div>
				<div className="flex items-end justify-center lg:justify-start">
					<div className="w-md space-y-9 bg-white rounded-t-2xl p-10">
						<div className="text-left">
							<h2 className="text-xs md:text-sm font-medium">WELCOME BACK!</h2>
							<p className=" text-xl md:text-2xl lg:text-[26px] font-semibold">Log In to your Account</p>
						</div>

						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<div>
													<Label htmlFor="email">Email</Label>
													<Input
														placeholder="Email"
														{...field}
														className="w-full p-2 border border-black rounded-md bg-white text-black focus:ring-0 focus:border-black"
													/>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<div>
													<Label htmlFor="email">Password</Label>
													<Input
														type="password"
														placeholder="Password"
														{...field}
														className="w-full p-2 border border-black rounded-md bg-white text-black focus:ring-0 focus:border-black"
													/>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<div className="flex gap-2 items-center justify-between flex-wrap">
									<FormField
										control={form.control}
										name="rememberMe"
										render={({ field }) => (
											<div className="flex items-center space-x-2">
												<Checkbox
													id="rememberMe"
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
												<label
													htmlFor="rememberMe"
													className=" text-xs md:text-sm font-medium leading-none"
												>
													Remember me
												</label>
											</div>
										)}
									/>
									<Button
										type="button"
										variant="link"
										className="p-0 text-[#424242] text-xs md:text-sm"
									>
										Forgot Password?
									</Button>
								</div>

								<Button
									type="submit"
									className="w-full bg-red-600 text-white border border-red-600 rounded-md hover:bg-red-700"
									disabled={isLoading}
								>
									{isLoading ? 'Logging in...' : 'Log In'}
								</Button>

								<div className="relative hidden md:block">
									<div className="absolute inset-0 flex items-center">
										<span className="w-full border-t border-[#E0E0E0]" />
									</div>
									<div className="relative flex justify-center text-xs">
										<span className="bg-white px-2 text-black font-semibold">
											Or
										</span>
									</div>
								</div>

								<div className="hidden md:grid gap-3">
									<Button type="button" variant="outline" className="relative">
										<FcGoogle className="absolute left-6 md:left-14 h-4 w-4" />
										Log In with Google
									</Button>
									<Button type="button" variant="outline" className="relative">
										<FaFacebook className="absolute fill-[#039BE5] left-6 md:left-14 mr-2 h-4 w-4" />
										Log In with Facebook
									</Button>
									<Button type="button" variant="outline" className="relative">
										<FaApple className="absolute fill-black left-6 md:left-14 mr-2 h-4 w-4" />
										Log In with Apple
									</Button>
								</div>

								<p className="text-center text-xs md:text-sm text-black">
									New User?{' '}
									<Button
										type="button"
										variant="link"
										className="px-0 text-black !text-xs !md:text-sm font-semibold"
									>
										SIGN UP HERE
									</Button>
								</p>
							</form>
						</Form>
					</div>
				</div>
			</div>
		</div>
	)
}
