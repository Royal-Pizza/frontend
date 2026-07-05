export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ') // on sépare les mots par espaces
    .map(word => 
      word
        .split('-') // on sépare les sous-mots par tirets
        .map(sub => sub.charAt(0).toUpperCase() + sub.slice(1)) // capitalise chaque sous-mot
        .join('-') // on remet les sous-mots ensemble avec le tiret
    )
    .join(' '); // on remet les mots ensemble avec un espace
}