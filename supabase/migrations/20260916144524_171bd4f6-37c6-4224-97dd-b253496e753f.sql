REVOKE ALL ON FUNCTION public.grant_admin_on_signup() FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.touch_updated_at() FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;