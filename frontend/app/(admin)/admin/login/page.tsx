'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { apiClient } from '@/lib/api/client';

type FormErrors = {
	email?: string;
	password?: string;
	general?: string;
};

export default function AdminLoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [rememberMe, setRememberMe] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<FormErrors>({});

	const canSubmit = useMemo(() => {
		return email.trim().length > 0 && password.trim().length > 0 && !isLoading;
	}, [email, password, isLoading]);

	function validateForm() {
		const nextErrors: FormErrors = {};
		const normalizedEmail = email.trim().toLowerCase();
		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!normalizedEmail) {
			nextErrors.email = 'Email is required';
		} else if (!emailPattern.test(normalizedEmail)) {
			nextErrors.email = 'Please enter a valid email address';
		}

		if (!password) {
			nextErrors.password = 'Password is required';
		} else if (password.length < 8) {
			nextErrors.password = 'Password must be at least 8 characters';
		}

		setErrors(nextErrors);
		return Object.keys(nextErrors).length === 0;
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsLoading(true);
		setErrors({});

		try {
			const res = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: email.trim().toLowerCase(),
					password,
					rememberMe,
				}),
			});

			if (!res.ok) throw new Error('Login failed');

			router.push('/admin/dashboard');
			router.refresh();
		} catch {
			setErrors({ general: 'Invalid admin credentials' });
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_18%_20%,#eff4ff_0%,#e4edff_28%,#dae5fb_52%,#edf3ff_100%)] px-4 py-4 text-[#102a5c] sm:px-6">
			<div className="pointer-events-none absolute inset-0 opacity-[0.45] [background-image:linear-gradient(rgba(22,57,120,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(22,57,120,0.08)_1px,transparent_1px)] [background-size:36px_36px]" />
			<div className="pointer-events-none absolute -left-28 top-[-5rem] h-72 w-72 rounded-full bg-[#cddfff] blur-3xl" />
			<div className="pointer-events-none absolute right-[-6rem] top-[10%] h-64 w-64 rounded-full bg-[#ffe2e2] blur-3xl" />
			<div className="pointer-events-none absolute bottom-[-6rem] left-[28%] h-64 w-64 rounded-full bg-[#dce8ff] blur-3xl" />

			<section className="relative z-10 w-full max-w-[25rem] rounded-[1.35rem] border border-white/85 bg-[linear-gradient(160deg,rgba(255,255,255,0.83)_0%,rgba(246,250,255,0.75)_60%,rgba(255,255,255,0.8)_100%)] p-5 shadow-[0_26px_70px_rgba(20,49,107,0.2)] ring-1 ring-[#d6e4ff]/80 backdrop-blur-2xl sm:p-6">
				<div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.9),transparent)]" />
				<div className="mb-5 flex flex-col items-center text-center">
					<LogoBlock compact />
				</div>

				<div className="mb-5 text-center">
					<h2 className="text-xl font-bold tracking-[-0.02em] text-[#0f2d68] sm:text-2xl">Administrator Login</h2>
					<p className="mt-1 text-xs text-[#5573aa] sm:text-sm">Enter your credentials to continue</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
					<div>
						<label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-[#10306d]">
							Email Address
						</label>
						<div className="flex h-10 items-center gap-2.5 rounded-xl border border-[#c8d9ff] bg-white/85 px-3 shadow-[0_6px_16px_rgba(61,102,174,0.08),inset_0_1px_0_rgba(255,255,255,0.72)]">
							<Mail className="h-4 w-4 text-[#5472aa]" />
							<input
								id="email"
								name="email"
								type="email"
								value={email}
								onChange={(event) => setEmail(event.target.value)}
								placeholder="admin@erimuventures.com"
								className="w-full bg-transparent text-sm text-[#17386f] placeholder:text-[#8098c5] outline-none"
								autoComplete="email"
							/>
						</div>
						{errors.email ? <p className="mt-1.5 text-xs text-rose-600">{errors.email}</p> : null}
					</div>

					<div>
						<label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-[#10306d]">
							Password
						</label>
						<div className="flex h-10 items-center gap-2.5 rounded-xl border border-[#c8d9ff] bg-white/85 px-3 shadow-[0_6px_16px_rgba(61,102,174,0.08),inset_0_1px_0_rgba(255,255,255,0.72)]">
							<Lock className="h-4 w-4 text-[#5472aa]" />
							<input
								id="password"
								name="password"
								type={showPassword ? 'text' : 'password'}
								value={password}
								onChange={(event) => setPassword(event.target.value)}
								placeholder="Enter password"
								className="w-full bg-transparent text-sm text-[#17386f] placeholder:text-[#8098c5] outline-none"
								autoComplete="current-password"
							/>
							<button
								type="button"
								onClick={() => setShowPassword((value) => !value)}
								className="rounded-full p-1 text-[#5a78b0] transition hover:bg-[#eaf1ff] hover:text-[#17386f]"
								aria-label={showPassword ? 'Hide password' : 'Show password'}
							>
								{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
							</button>
						</div>
						{errors.password ? <p className="mt-1.5 text-xs text-rose-600">{errors.password}</p> : null}
					</div>

					<div className="flex flex-wrap items-center justify-between gap-2 text-sm">
						<label className="inline-flex items-center gap-2 text-[#2c4b84]">
							<input
								type="checkbox"
								checked={rememberMe}
								onChange={(event) => setRememberMe(event.target.checked)}
								className="h-4 w-4 rounded border-[#9ab4e8] bg-transparent text-[#e92a2a] focus:ring-[#e92a2a]"
							/>
							Remember me
						</label>
						<Link href="mailto:support@erimuventures.com" className="text-[#2f59ad] hover:text-[#183d81]">
							Forgot password?
						</Link>
					</div>

					{errors.general ? (
						<p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
							{errors.general}
						</p>
					) : null}

					<button
						type="submit"
						disabled={!canSubmit}
						className="flex h-10 w-full items-center justify-center rounded-xl bg-[linear-gradient(96deg,#d92121,#ff3b3b)] text-sm font-bold text-white shadow-[0_14px_26px_rgba(217,33,33,0.34)] transition hover:translate-y-[-1px] hover:brightness-110 disabled:cursor-not-allowed disabled:bg-red-300/70"
					>
						{isLoading ? 'Signing in...' : 'Sign In'}
					</button>
				</form>

				<footer className="mt-4 border-t border-[#e1e9fb] pt-3 text-center text-[11px] text-[#6a82ae]">
					© 2026 Erimu Land Ltd. All rights reserved.
				</footer>
			</section>
		</main>
	);
}

function LogoBlock({ compact = false }: { compact?: boolean }) {
	return (
		<div className="flex items-center justify-center gap-3">
			<Image
				src="/erimuland%20logo.png"
				alt="Erimu Land Ltd logo"
				width={280}
				height={72}
				className={compact ? 'h-auto w-24 sm:w-28' : 'h-auto w-52 xl:w-60'}
				priority
			/>
		</div>
	);
}
