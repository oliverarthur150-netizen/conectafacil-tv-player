import { supabase } from "./supabase"

export async function listarAnunciosDaTela(
  codigoTela = "LANCHA-01"
) {
  const { data: tela, error: telaError } =
    await supabase
      .from("telas")
      .select("id,codigo,nome")
      .eq("codigo", codigoTela)
      .single()

  if (telaError) {
    throw new Error(
      `Erro ao localizar a tela ${codigoTela}: ${telaError.message}`
    )
  }

  const { data, error } = await supabase
    .from("anuncios_telas")
    .select(`
      anuncio_id,
      anuncios (
        id,
        titulo,
        cliente,
        tipo_midia,
        arquivo_url,
        arquivo_path,
        duracao_segundos,
        status,
        prioridade,
        data_inicio,
        data_termino,
        criado_em
      )
    `)
    .eq("tela_id", tela.id)

  if (error) {
    throw new Error(
      `Erro ao carregar anúncios: ${error.message}`
    )
  }

  const anuncios = (data || [])
    .map((item) => item.anuncios)
    .filter(Boolean)
    .filter((anuncio) => anuncio.status === "ativo")
    .sort((a, b) => {
      const prioridadeA = Number(a.prioridade || 0)
      const prioridadeB = Number(b.prioridade || 0)

      if (prioridadeA !== prioridadeB) {
        return prioridadeB - prioridadeA
      }

      return new Date(a.criado_em) - new Date(b.criado_em)
    })

  return {
    tela,
    anuncios,
  }
}