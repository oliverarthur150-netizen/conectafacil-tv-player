
import { CONFIG_TV } from "../config";
import { listarAnunciosDaTela } from "./anuncios.service";
import { listarEmbarquesDaTela } from "./embarques.service";

/**
 * Sincroniza anúncios e embarques da TV.
 * Não depende de configuracoes_player.
 */
export async function sincronizarTela(
  codigoTela = CONFIG_TV.codigo
) {
  const [resultadoAnuncios, resultadoEmbarques] =
    await Promise.allSettled([
      listarAnunciosDaTela(codigoTela),
      listarEmbarquesDaTela(codigoTela),
    ]);

  const anunciosOk =
    resultadoAnuncios.status === "fulfilled";

  const embarquesOk =
    resultadoEmbarques.status === "fulfilled";

  if (!anunciosOk && !embarquesOk) {
    throw new Error(
      "Não foi possível sincronizar anúncios nem embarques."
    );
  }

  return {
    sucesso: anunciosOk && embarquesOk,

    anuncios: anunciosOk
      ? resultadoAnuncios.value.anuncios || []
      : [],

    embarques: embarquesOk
      ? resultadoEmbarques.value || []
      : [],

    erros: {
      anuncios: anunciosOk
        ? null
        : resultadoAnuncios.reason?.message,

      embarques: embarquesOk
        ? null
        : resultadoEmbarques.reason?.message,
    },

    sincronizadoEm: new Date().toISOString(),
  };
}
