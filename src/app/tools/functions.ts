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

export function formatErrorMessage(err: any): string | any {

  let error;
  // Si le backend renvoie un vrai objet JSON
  if (err.error && typeof err.error === 'object') {
    console.log('Fekir 1');
    error = err.error.message;
  }
  // Si le backend renvoie une chaîne JSON (ex: '{"message":"Mot de passe incorrect"}')
  else if (typeof err.error === 'string') {
    console.log('Fekir 2');
    try {
      console.log('Fekir 3');
      const parsed = JSON.parse(err.error);
      error = parsed.message || err.error;
    } catch {
    console.log('Fekir 4');
      error = err.error;
    }
  }
    console.log('Fekir 5');
    console.log('Formatted err message:', err);
    console.log('typeof err.error:', typeof err.error);
    console.log('typeof err:', typeof err);
    return error;
}