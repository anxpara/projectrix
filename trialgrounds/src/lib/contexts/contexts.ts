import { Context } from 'runed';
import type { Options } from '$lib/options';
import type { Store } from '$lib/stores/Store';
import type { Trial } from '$lib/trials/trials.svelte';

export const optionsStoreContext = new Context<Store<Options>>('optionsStore');
export const defaultSubjectStoreContext = new Context<Store<HTMLElement>>('defaultSubjectStore');
export const currentTrialStoreContext = new Context<Store<Trial>>('currentTrialStore');
