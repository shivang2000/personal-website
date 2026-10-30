"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

import s from "./product.module.css";

export function CopyEmail({ email }: { email: string }) {
	const [copied, setCopied] = useState(false);
	const timer = useRef<number | undefined>(undefined);

	useEffect(() => () => window.clearTimeout(timer.current), []);

	const copy = async () => {
		try {
			await navigator.clipboard.writeText(email);
			setCopied(true);
			window.clearTimeout(timer.current);
			timer.current = window.setTimeout(() => setCopied(false), 1800);
		} catch {
			window.location.href = `mailto:${email}`;
		}
	};

	return (
		<button type="button" className={s.copy} onClick={copy} data-copied={copied ? "" : undefined}>
			<span>{email}</span>
			<span className={s.copyIcon} aria-hidden="true">
				<Copy size={16} strokeWidth={1.5} />
				<Check size={16} strokeWidth={1.75} />
			</span>
			<span className="sr-only" aria-live="polite">
				{copied ? "Email address copied" : ""}
			</span>
		</button>
	);
}
