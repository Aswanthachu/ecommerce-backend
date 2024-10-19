import { IProject, projectType } from '../../model/projects'

interface IProjectRepo {
  addProject(data: projectType): Promise<[boolean, Error | null, number]>
  getAllProjects(): Promise<[IProject[] | null, Error | null, number]>
  editProject(
    data: projectType & {
      id: string
    }
  ): Promise<[IProject | null, Error | null, number]>
  getProject(id: string): Promise<[IProject | null, Error | null, number]>
  updateProjectStatus(data: { id: string; status: boolean }): Promise<[IProject | null, Error | null, number]>
  deleteProject(id: string): Promise<[boolean, Error | null, number]>
}

export default IProjectRepo
