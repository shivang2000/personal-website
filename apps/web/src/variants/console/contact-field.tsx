"use client";

import { ArrowRight } from "lucide-react";
import { useId, useState } from "react";

import { person } from "@/lib/data/profile";

import s from "./console.module.css";
import { mailtoFor, subjectFor } from "./lib";

/** Type the company, get an email with the subject already written. */
export function ContactField() {
	const [company, setCompany] = useState("");
	const id = useId();
	const href = mailtoFor(company);

	return (
		<form
			className={s.contactForm}
			action={href}
			onSubmit={(e) => {
				e.preventDefault();
				window.location.href = href;
			}}
		>
			<label htmlFor={`${id}-company`} className={s.contactLabel}>
				Company you're hiring for
			</label>
			<div className={s.fieldRow}>
				<input
					id={`${id}-company`}
					name="company"
					className={s.field}
					value={company}
					onChange={(e) => setCompany(e.target.value)}
					placeholder="Your company"
					autoComplete="organization"
					maxLength={60}
					aria-describedby={`${id}-preview`}
				/>
				<button type="submit" className={s.fieldSubmit} aria-label={`Write an email to ${person.name}`}>
					<ArrowRight aria-hidden size={20} strokeWidth={2} />
				</button>
			</div>
			<p id={`${id}-preview`} className={s.preview} data-ui>
				<span className={s.previewKey}>to</span>
				<span>{person.email}</span>
				<span className={s.previewKey}>subject</span>
				<span>{subjectFor(company)}</span>
			</p>
		</form>
	);
}
