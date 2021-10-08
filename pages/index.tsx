import { useEffect, useState, useRef } from 'react'
import QuestaoModel from '../model/questao'
import Questionario from '../components/Questionario'
import { useRouter } from 'next/router'

const BASE_URL = 'http://localhost:3000/api'

export default function Home() {
  const router = useRouter()


  const [IdsDasQuestoes, setIdsDasQuestoes] = useState<number[]>([])
  const [questao, setQuestao] = useState<QuestaoModel>()
  const [respostasCertas, setRespostasCertas] = useState<number>(0)

  async function carregarIdsDasQuestoes() {
    const resp = await fetch(`${BASE_URL}/questionario`)
    const idsDasQuestoes = await resp.json()
    setIdsDasQuestoes(idsDasQuestoes)
  }

  async function carregarQuestao(idQuestao: number) {
    const resp = await fetch(`${BASE_URL}/questoes/${idQuestao}`)
    const json = await resp.json()
    const novaQuestao = QuestaoModel.criarUsandoObjeto(json)
    setQuestao(novaQuestao)
  }

  useEffect(() => {
    carregarIdsDasQuestoes()
  }, [])

  useEffect(() => {
    IdsDasQuestoes.length > 0 && carregarQuestao(IdsDasQuestoes[0])
  }, [IdsDasQuestoes])


  function questaoRespondida(questaoRespondida: QuestaoModel) {
    setQuestao(questaoRespondida)
    const acertou = questaoRespondida.acertou
    setRespostasCertas(respostasCertas + (acertou ? 1 : 0))
  }

  function idProximaPergunta() {

    const proximoIndice = IdsDasQuestoes.indexOf(questao.id) + 1
    return IdsDasQuestoes[proximoIndice]

  }
  function irParaProximoPasso() {
    const proximoId = idProximaPergunta()
    proximoId ? irParaProximaQuestao(proximoId) : finalizar()

  }

  function irParaProximaQuestao(proximoId: number) {
    carregarQuestao(proximoId)
  }

  function finalizar() {
    router.push({
      pathname: "/resultado",
      query: {
        total: IdsDasQuestoes.length,
        certas: respostasCertas
      }
    })

  }


  return (
    questao ?
      <Questionario
        questao={questao}
        ultima={idProximaPergunta() === undefined}
        questaoRespondida={questaoRespondida}
        irParaProximoPasso={irParaProximoPasso} />
      : false)

}
