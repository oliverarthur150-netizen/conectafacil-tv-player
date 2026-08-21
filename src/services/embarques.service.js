import { supabase } from "./supabase"

export async function listarEmbarquesDaTela(
  codigoTela = "LANCHA-01"
) {
  const { data, error } = await supabase
    .from("embarques")
    .select(`
      id,
      tela_codigo,
      origem,
      destino,
      horario,
      status,
      ativo
    `)
    .eq("tela_codigo", codigoTela)
    .eq("ativo", true)
    .order("horario", {
      ascending: true,
    })

  if (error) {
    throw new Error(
      `Erro ao carregar embarques: ${error.message}`
    )
  }

  return data || []
}