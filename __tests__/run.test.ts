import { has } from 'lodash'
import { GitHub } from '@actions/github'

import run from '../src/run'

describe('Run function', () => {
    let github: {new(token: string): GitHub}
    let getLatestRelease: jest.Mock<any>
    let createDispatchEvent: jest.Mock<any>
    let core: {
        getInput: (key: string, opts?: { required: boolean }) => string | undefined
        setOutput: (name: string, value: string) => void
        info: (...args: any[]) => void
        debug: (...args: any[]) => void
        setFailed: (message: string) => void
        [k: string]: any
    }
    let inputs: Record<string, string | undefined>

    beforeEach(() => {
        getLatestRelease = jest.fn(() => Promise.resolve({
            data: {
                tag_name: 'v1.0.1',
            },
        })),
        createDispatchEvent = jest.fn(() => Promise.resolve()),
        github = class {
            repos = {
                getLatestRelease,
                createDispatchEvent,
            }
        } as any as {new(token: string): GitHub}
        inputs = {
            token: 'footoken',
            domain: 'peachjar.com',
            target: 'noop',
        }
        core = {
            getInput: jest.fn((key: string) => {
                if (!has(inputs, key)) {
                    throw new Error(`Invalid property [${key}] accessed.`)
                }
                return inputs[key]
            }),
            setOutput: jest.fn(),
            debug: jest.fn(),
            info: jest.fn(),
            setFailed: jest.fn()
        }
    })

    describe('when the [token] is not supplied', () => {
        beforeEach(() => {
            inputs.token = undefined
        })

        it('should fail the action', async () => {
            await run(github, core)
            expect(core.setFailed).toHaveBeenCalled()
        })
    })

    describe('when the [domain] is not supplied', () => {
        beforeEach(() => {
            inputs.domain = undefined
        })

        it('should fail the action', async () => {
            await run(github, core)
            expect(core.setFailed).toHaveBeenCalled()
        })
    })

    describe('when the [target] is not supplied', () => {
        beforeEach(() => {
            inputs.target = undefined
        })

        it('should get the latest release from Github as the target', async () => {
            await run(github, core)
            expect(getLatestRelease).toHaveBeenCalled()
            expect(createDispatchEvent).toHaveBeenCalledWith({
                owner: 'peachjar',
                repo: 'peachjar-tests',
                event_type: 'run-e2e',
                client_payload: {
                    domain: 'peachjar.com',
                    target: 'v1.0.1',
                },
            })
        })
    })

    describe('when the [target] is supplied', () => {
        it('should get the latest release from Github as the target', async () => {
            await run(github, core)
            expect(getLatestRelease).not.toHaveBeenCalled()
            expect(createDispatchEvent).toHaveBeenCalledWith({
                owner: 'peachjar',
                repo: 'peachjar-tests',
                event_type: 'run-e2e',
                client_payload: {
                    domain: 'peachjar.com',
                    target: 'noop',
                },
            })
        })
    })
})
