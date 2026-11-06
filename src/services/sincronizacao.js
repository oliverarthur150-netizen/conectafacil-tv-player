
import { CONFIG_TV } from "../config";
import { supabase } from "./supabase";
import { listarAnunciosDaTela } from "./anuncios.service";
import { listarEmbarquesDaTela } from "./embarques.service";

/**
 * Localiza a TV cadastrada no Supabase.
 */
export async function localizarTela(
  codigoTela = CONFIG_TV.codigo
) {
  const { data, error } = await supabase
    .from("telas")
    .select("id, codigo, nome, local")
    .eq("codigo", codigoTela)
    .single();

  if (error) {
    throw new Error(
      `Erro ao localizar TV: ${error.message}`
    );
  }

  return data;
}

/**
 * Busca as configurações da TV.
 */
export async function carregarConfiguracaoTela(
  telaId
) {
  const { data, error } = await supabase
    .from("configuracoes_player")
    .select(
      "intervalo_sincronizacao, volume, modo_tela_cheia"
    )
    .eq("tela_id", telaId)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Erro nas configurações: ${error.message}`
    );
  }

  return data || {
    intervalo_sincronizacao:
      CONFIG_TV.intervaloSincronizacao,
    volume: 0,
    modo_tela_cheia: true,
  };
}

/**
 * Sincroniza os dados da TV.
 */
export async function sincronizarTela(
  codigoTela = CONFIG_TV.codigo
) {
  const tela = await localizarTela(codigoTela);

  const [
    configuracao,
    resultadoAnuncios,
    embarques,
  ] = await Promise.all([
    carregarConfiguracaoTela(tela.id),
    listarAnunciosDaTela(codigoTela),
    listarEmbarquesDaTela(codigoTela),
  ]);

  return {
    sucesso: true,
    tela,
    configuracao,
    anuncios: resultadoAnuncios.anuncios || [],
    embarques: embarques || [],
    sincronizadoEm: new Date().toISOString(),
  };
}
