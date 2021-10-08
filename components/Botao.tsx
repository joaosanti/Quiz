import styles from '../styles/Botao.module.css'
import Link from 'next/link'

interface BotaoPorps {
    href?: string
    texto: string
    onclick?: (e: any) => void
}

export default function Botao(props: BotaoPorps) {


    function renderizarBotao() {
        return (
            < button className={styles.botao}
                onClick={props.onclick} >
                {props.texto}
            </button >
        )
    }

    return props.href ? (
        <Link href={props.href} passHref>
            {renderizarBotao()}
        </Link>
    ) : renderizarBotao()

}