CREATE OR REPLACE FUNCTION public.club_setup_available()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role IN ('super_admin','club_admin'))
$$;
CREATE OR REPLACE FUNCTION public.claim_first_super_admin()
RETURNS boolean LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
  PERFORM pg_advisory_xact_lock(hashtext('club_first_admin_setup'));
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role IN ('super_admin','club_admin')) THEN
    RETURN false;
  END IF;
  INSERT INTO public.user_roles(user_id, role) VALUES (auth.uid(), 'super_admin');
  RETURN true;
END $$;
REVOKE EXECUTE ON FUNCTION public.club_setup_available() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.claim_first_super_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.club_setup_available() TO authenticated;
GRANT EXECUTE ON FUNCTION public.claim_first_super_admin() TO authenticated;