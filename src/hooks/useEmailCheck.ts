const { data, error } = await supabase.auth.signUp({
  email,
  password,
});
if (error) {
  setError(error.message); // display this to the user
}
