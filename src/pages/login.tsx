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
			<div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/70 grid grid-cols-2 gap-40">
				<div className="flex flex-col gap-24 justify-center items-end">
					<div className="flex w-md items-center gap-2 text-white">
						<Image src="/assets/logo.svg" alt="Logo" width={270} height={64} />
					</div>
					<div className="w-md text-white">
						<h1 className="text-4xl font-bold mb-4">Building the Future...</h1>
						<p className="text-base font-light">
							Manage tasks effortlessly with an interactive editor, real-time
							tracking, secure authentication, and seamless API integration—all in one
							place.
						</p>
					</div>
				</div>
				<div className="flex items-end justify-start">
					<div className="w-md space-y-9 bg-white rounded-t-2xl p-10">
						<div className="text-left">
							<h2 className="text-sm font-medium">WELCOME BACK!</h2>
							<p className="text-[26px] font-semibold">Log In to your Account</p>
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

								<div className="flex items-center justify-between">
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
													className="text-sm font-medium leading-none"
												>
													Remember me
												</label>
											</div>
										)}
									/>
									<Button
										type="button"
										variant="link"
										className="p-0 text-[#424242] text-sm"
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

								<div className="relative">
									<div className="absolute inset-0 flex items-center">
										<span className="w-full border-t border-[#E0E0E0]" />
									</div>
									<div className="relative flex justify-center text-xs">
										<span className="bg-white px-2 text-black font-semibold">
											Or
										</span>
									</div>
								</div>

								<div className="grid gap-3">
									<Button type="button" variant="outline" className="relative">
										<FcGoogle className="absolute left-14 h-4 w-4" />
										Log In with Google
									</Button>
									<Button type="button" variant="outline" className="relative">
										<FaFacebook className="absolute fill-[#039BE5] left-14 mr-2 h-4 w-4" />
										Log In with Facebook
									</Button>
									<Button type="button" variant="outline" className="relative">
										<FaApple className="absolute fill-black left-14 mr-2 h-4 w-4" />
										Log In with Apple
									</Button>
								</div>

								<p className="text-center text-sm text-black">
									New User?{' '}
									<Button
										type="button"
										variant="link"
										className="px-0 text-black font-semibold"
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
