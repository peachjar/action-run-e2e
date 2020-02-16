import { GitHub } from '@actions/github'

export default async function run(
    GitHubC: {new(token: string): GitHub},
    core: {
        getInput: (key: string, opts?: { required: boolean }) => string | undefined
        setOutput: (name: string, value: string) => void
        debug: (...args: any[]) => void
        info: (...args: any[]) => void
        setFailed: (message: string) => void
        [k: string]: any
    }
): Promise<void> {
    try {
        const token = core.getInput('token', { required: true })

        if (!token) {
            return core.setFailed('[token] not supplied or invalid.')
        }

        const github = new GitHubC(token)

        const domain = core.getInput('domain', { required: true })

        if (!domain) {
            return core.setFailed('[domain] not supplied or invalid.')
        }

        let target = core.getInput('target')

        if (!target) {

            core.debug('[target] not supplied.  Looking up latest release.')

            const { data: release } = await github.repos.getLatestRelease({
                owner: 'peachjar',
                repo: 'peachjar-tests',
            })

            target = release.tag_name
        }

        core.debug('Dispatching event to peachjar-tests repo.')

        await github.repos.createDispatchEvent({
            owner: 'peachjar',
            repo: 'peachjar-tests',
            event_type: 'run-e2e',
            client_payload: {
                domain,
                target,
            },
        })

        core.info(`Deployment status set`)

    } catch (error) {

        core.setFailed(error.message)
    }
}
