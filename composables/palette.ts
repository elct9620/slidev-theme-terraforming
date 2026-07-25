/**
 * The palette entries a deck may name.
 *
 * A component takes a colour rather than a role, because what a colour stands for belongs
 * to the deck: one talk's yellow is a proxy, another's is a warning. Stating the meaning
 * is the narration's job.
 *
 * These are the entries styles/components.css paints, so adding one means adding it in
 * both places — there is no way for a stylesheet to tell TypeScript which hues it knows.
 */
export type Colour = 'gunJyo' | 'tamago' | 'jinZamOmi' | 'gray'
