import { setInlineStyles, getProjection } from 'projectrix';

function match(target: HTMLElement, subject: HTMLElement): void {
  setInlineStyles(target, getProjection(subject, target).toSubject);
}